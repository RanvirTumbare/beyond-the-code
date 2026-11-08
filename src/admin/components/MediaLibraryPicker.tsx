import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useGallery } from '@/hooks/useGallery';
import { Image, Check } from 'lucide-react';

interface MediaLibraryPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string | null;
}

export const MediaLibraryPicker: React.FC<MediaLibraryPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentUrl,
}) => {
  const { items } = useGallery(true);

  // Collect unique media URLs
  const mediaList = Array.from(
    new Set(
      items
        .map((i) => i.media_url)
        .filter(Boolean)
    )
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Media Library"
      subtitle="Select an existing uploaded media asset"
      maxWidth="2xl"
    >
      {mediaList.length === 0 ? (
        <div className="text-center py-12 text-[#777F79]">
          <Image className="w-8 h-8 mx-auto mb-2 text-[#9CA39E]" />
          <p className="text-sm">No media assets found in gallery.</p>
          <p className="text-xs mt-1">Upload a new photo via the file uploader.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
          {mediaList.map((url, idx) => {
            const isSelected = currentUrl === url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelect(url);
                  onClose();
                }}
                className={`relative group aspect-video rounded-editorial overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-[#43866A] ring-2 ring-[#43866A]/30'
                    : 'border-[#E8ECE9] hover:border-[#43866A]'
                }`}
              >
                <img
                  src={url}
                  alt={`Media asset ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-[#43866A]/30 flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-white text-[#43866A] flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
};
