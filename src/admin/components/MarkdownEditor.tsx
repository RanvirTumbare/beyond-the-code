import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Eye,
  Edit,
} from 'lucide-react';

export interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  helperText?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  label = 'Content (Markdown)',
  value,
  onChange,
  placeholder = 'Write your thoughts or case study in Markdown...',
  rows = 12,
  helperText = 'Supports GitHub Flavored Markdown (headings, lists, code snippets, links, blockquotes).',
}) => {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (before: string, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    const replacement = `${before}${selected || 'text'}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected.length || 4)
      );
    }, 0);
  };

  return (
    <div className="w-full space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
            {label}
          </label>
        )}
        <div className="flex items-center border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7] p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              tab === 'write'
                ? 'bg-white text-[#202520] font-medium shadow-xs'
                : 'text-[#777F79] hover:text-[#202520]'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              tab === 'preview'
                ? 'bg-white text-[#43866A] font-medium shadow-xs'
                : 'text-[#777F79] hover:text-[#202520]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {tab === 'write' ? (
        <div className="border border-[#E8ECE9] rounded-editorial overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#43866A] focus-within:border-transparent">
          {/* Markdown Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-[#F7F8F7] border-b border-[#E8ECE9] overflow-x-auto text-[#585F5A]">
            <button
              type="button"
              onClick={() => insertSnippet('**', '**')}
              title="Bold"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('*', '*')}
              title="Italic"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-4 bg-[#D5DDD8] mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet('## ', '')}
              title="Heading 2"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('### ', '')}
              title="Heading 3"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-4 bg-[#D5DDD8] mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet('- ', '')}
              title="Bullet List"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('1. ', '')}
              title="Numbered List"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('> ', '')}
              title="Quote"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-4 bg-[#D5DDD8] mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet('```ts\n', '\n```')}
              title="Code Block"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('[', '](https://)')}
              title="Hyperlink"
              className="p-1.5 rounded hover:bg-[#EFF2F0] hover:text-[#202520] transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 text-xs sm:text-sm font-mono leading-relaxed bg-white text-[#202520] placeholder-[#9CA39E] focus:outline-none resize-y"
          />
        </div>
      ) : (
        /* Preview View */
        <div className="border border-[#E8ECE9] rounded-editorial p-6 bg-white min-h-[240px] max-h-[500px] overflow-y-auto">
          {value ? (
            <div className="prose prose-sm max-w-none text-[#202520] prose-headings:font-serif prose-headings:text-[#202520] prose-a:text-[#43866A] prose-code:text-[#43866A] prose-code:bg-[#EBF3EF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#141814] prose-pre:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-xs text-[#9CA39E] italic">Nothing to preview yet.</p>
          )}
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-[#777F79] mt-1">{helperText}</p>
      )}
    </div>
  );
};

