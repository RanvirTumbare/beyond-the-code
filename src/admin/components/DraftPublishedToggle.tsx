import React from 'react';
import { PublishStatus } from '@/lib/types';

interface DraftPublishedToggleProps {
  status: PublishStatus;
  onChange: (status: PublishStatus) => void;
  label?: string;
}

export const DraftPublishedToggle: React.FC<DraftPublishedToggleProps> = ({
  status,
  onChange,
  label = 'Publication Status',
}) => {
  const isPublished = status === 'published';

  return (
    <div className="flex items-center justify-between p-3.5 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial">
      <div>
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
          {label}
        </span>
        <span className="text-xs text-[#777F79]">
          {isPublished
            ? 'Visible to the public on the website'
            : 'Private draft — hidden from public view'}
        </span>
      </div>
      <div className="flex items-center bg-white border border-[#E8ECE9] rounded-full p-0.5 shadow-sm">
        <button
          type="button"
          onClick={() => onChange('draft')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            !isPublished
              ? 'bg-[#202520] text-white shadow-xs'
              : 'text-[#777F79] hover:text-[#202520]'
          }`}
        >
          Draft
        </button>
        <button
          type="button"
          onClick={() => onChange('published')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            isPublished
              ? 'bg-[#43866A] text-white shadow-xs'
              : 'text-[#777F79] hover:text-[#202520]'
          }`}
        >
          Published
        </button>
      </div>
    </div>
  );
};

