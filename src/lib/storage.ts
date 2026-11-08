import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Resizes an image file on the client using HTML5 Canvas to a max dimension of 1920px
 * while maintaining aspect ratio and compressing quality.
 */
export async function resizeImageClientSide(file: File, maxDimension = 1920, quality = 0.85): Promise<Blob> {
  // If not an image (e.g. PDF), return original file blob
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // If SVG or GIF, preserve vector / animation
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file (or resized blob) to Supabase Storage 'media' bucket.
 * Returns the public URL.
 */
export async function uploadMediaFile(
  file: File,
  folder = 'uploads'
): Promise<{ url: string; error?: string }> {
  try {
    // 1. Client-side resize
    const processedBlob = await resizeImageClientSide(file);

    // 2. Prepare file name
    const ext = file.type.startsWith('image/') && !['image/svg+xml', 'image/gif'].includes(file.type)
      ? 'webp'
      : file.name.split('.').pop() || 'bin';

    const safeBase = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const uniqueName = `${folder}/${Date.now()}_${safeBase}.${ext}`;

    if (!isSupabaseConfigured) {
      // In offline/mock preview mode, generate data URL or local object URL
      const fallbackUrl = URL.createObjectURL(processedBlob);
      return { url: fallbackUrl };
    }

    // 3. Upload to Supabase 'media' bucket
    const { data, error } = await supabase.storage
      .from('media')
      .upload(uniqueName, processedBlob, {
        cacheControl: '31536000',
        upsert: false,
        contentType: processedBlob.type || file.type,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { url: '', error: error.message };
    }

    // 4. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    return { url: '', error: message };
  }
}
