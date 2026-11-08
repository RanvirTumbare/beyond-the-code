import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { uploadMediaFile } from '@/lib/storage';
import { MediaLibraryPicker } from './MediaLibraryPicker';
import { useToast } from '@/contexts/ToastContext';

export interface ImageUploaderProps {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Cover / Image Asset',
  value,
  onChange,
  folder = 'uploads',
  helperText = 'Supported formats: PNG, JPG, WebP. Resized client-side to max 1920px.',
  aspectRatio = 'video',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: toastError, success } = useToast();

  const handleFileProcess = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await uploadMediaFile(file, folder);
      if (res.error) {
        toastError(res.error);
      } else if (res.url) {
        onChange(res.url);
        success('Asset processed and uploaded.');
      }
    } catch {
      toastError('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const aspectStyles = {
    square: 'aspect-square max-w-[200px]',
    video: 'aspect-video max-w-md',
    wide: 'aspect-[21/9] max-w-lg',
    auto: 'h-48 max-w-md',
  };

  return (
    <div className="w-full space-y-2 text-left">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-[#43866A] hover:underline"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Choose from Library</span>
          </button>
          <span className="text-[#D5DDD8]">|</span>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-xs text-[#777F79] hover:text-[#202520]"
          >
            {showManualInput ? 'Upload file' : 'Paste URL'}
          </button>
        </div>
      </div>

      {showManualInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-white text-sm border border-[#E8ECE9] rounded-editorial px-3 py-2 focus:ring-2 focus:ring-[#43866A] focus:outline-none"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (manualUrl.trim()) {
                onChange(manualUrl.trim());
                setManualUrl('');
                setShowManualInput(false);
              }
            }}
          >
            Apply
          </Button>
        </div>
      ) : value ? (
        /* Preview Card */
        <div className="relative group rounded-editorial border border-[#E8ECE9] overflow-hidden bg-[#F7F8F7] max-w-md">
          <div className={`${aspectStyles[aspectRatio]} overflow-hidden flex items-center justify-center bg-black/5`}>
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If broken URL
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>
          <div className="p-2.5 bg-white border-t border-[#E8ECE9] flex items-center justify-between text-xs">
            <span className="truncate max-w-[260px] text-[#777F79] font-mono">
              {value}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-[11px] px-2"
              >
                Change
              </Button>
              <button
                type="button"
                onClick={() => onChange(null)}
                aria-label="Remove image"
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-editorial p-6 text-center cursor-pointer transition-colors max-w-md ${
            isDragging
              ? 'border-[#43866A] bg-[#EBF3EF]/40'
              : 'border-[#D5DDD8] hover:border-[#43866A] bg-[#F7F8F7]/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#43866A] mb-2" />
              <p className="text-xs text-[#585F5A] font-medium">Optimizing & Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#202520]">
                Click or drag & drop to upload
              </p>
              <p className="text-[11px] text-[#777F79] mt-0.5">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Media Library Picker Modal */}
      <MediaLibraryPicker
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        currentUrl={value}
        onSelect={(url) => onChange(url)}
      />
    </div>
  );
};

