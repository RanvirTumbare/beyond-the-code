import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

export interface CategorySelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  defaultOptions: string[];
  existingItems?: { category?: string }[];
  placeholder?: string;
  helperText?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  label = 'Category',
  value,
  onChange,
  defaultOptions,
  existingItems = [],
  placeholder = 'Type custom category name...',
  helperText,
}) => {
  // Pool all known options (defaults + existing items + current value)
  const allKnownOptions = Array.from(
    new Set([
      ...defaultOptions,
      ...(existingItems.map((item) => item.category).filter(Boolean) as string[]),
      ...(value ? [value] : []),
    ])
  );

  const [isCustomMode, setIsCustomMode] = useState(
    Boolean(value && !defaultOptions.includes(value))
  );
  const [customInput, setCustomInput] = useState(value || '');

  useEffect(() => {
    if (value && !defaultOptions.includes(value)) {
      setCustomInput(value);
      setIsCustomMode(true);
    }
  }, [value, defaultOptions]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__CREATE_CUSTOM__') {
      setIsCustomMode(true);
      setCustomInput('');
      onChange('');
    } else {
      setIsCustomMode(false);
      onChange(selected);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    onChange(val);
  };

  const handleSwitchToDropdown = () => {
    setIsCustomMode(false);
    const fallback = allKnownOptions[0] || defaultOptions[0] || 'General';
    onChange(fallback);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => {
            if (isCustomMode) {
              handleSwitchToDropdown();
            } else {
              setIsCustomMode(true);
              setCustomInput(value || '');
            }
          }}
          className="text-[11px] text-[#43866A] hover:underline font-medium inline-flex items-center gap-1 transition-colors"
        >
          {isCustomMode ? (
            <span>Choose from list</span>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>+ Custom Category</span>
            </>
          )}
        </button>
      </div>

      {isCustomMode ? (
        <div className="relative">
          <input
            type="text"
            value={customInput}
            onChange={handleCustomInputChange}
            placeholder={placeholder}
            autoFocus
            required
            className="w-full bg-white text-xs sm:text-sm px-3 py-2 border border-[#43866A] rounded-editorial focus:ring-2 focus:ring-[#43866A]/20 focus:outline-none placeholder-[#9CA39E]"
          />
        </div>
      ) : (
        <div className="relative">
          <select
            value={value || defaultOptions[0] || ''}
            onChange={handleSelectChange}
            className="w-full bg-white text-xs sm:text-sm px-3 py-2 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none appearance-none pr-8 cursor-pointer"
          >
            {allKnownOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__CREATE_CUSTOM__" className="text-[#43866A] font-semibold">
              + Create New Category...
            </option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#777F79] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-[#777F79] mt-1">{helperText}</p>
      )}
    </div>
  );
};

