import React, { useState, useMemo } from 'react';
import { Search, Edit3, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface DataTableProps<T extends { id: string; status?: 'draft' | 'published' }> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (row: T, term: string) => boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onCreateNew?: () => void;
  createLabel?: string;
  rowsPerPage?: number;
}

export function DataTable<T extends { id: string; status?: 'draft' | 'published' }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilter,
  onEdit,
  onDelete,
  isLoading = false,
  emptyTitle = 'No entries found',
  emptyMessage = 'Get started by creating your first entry.',
  onCreateNew,
  createLabel = 'Create New',
  rowsPerPage = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Status filter
      if (statusFilter !== 'all' && row.status) {
        if (row.status !== statusFilter) return false;
      }
      // Search term
      if (!searchTerm.trim()) return true;
      if (searchFilter) {
        return searchFilter(row, searchTerm.toLowerCase());
      }
      // Default: inspect all string properties
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, statusFilter, searchFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  return (
    <div className="w-full bg-white border border-[#E8ECE9] rounded-editorial shadow-subtle overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E8ECE9] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F7F8F7]/40">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white text-xs sm:text-sm pl-9 pr-3 py-2 border border-[#E8ECE9] rounded-editorial focus:outline-none focus:ring-2 focus:ring-[#43866A] placeholder-[#9CA39E]"
            />
          </div>

          {/* Status Filter Pill */}
          <div className="flex items-center border border-[#E8ECE9] rounded-editorial bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#202520] text-white font-medium'
                  : 'text-[#777F79] hover:text-[#202520]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('published');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'published'
                  ? 'bg-[#43866A] text-white font-medium'
                  : 'text-[#777F79] hover:text-[#202520]'
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('draft');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-[#777F79] text-white font-medium'
                  : 'text-[#777F79] hover:text-[#202520]'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        {onCreateNew && (
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateNew}
            className="w-full sm:w-auto"
          >
            {createLabel}
          </Button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F7F8F7] border-b border-[#E8ECE9] text-[11px] font-semibold text-[#585F5A] uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="py-3 px-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8ECE9]">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <Skeleton variant="text" width="80%" />
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="py-4 px-4 text-right">
                      <Skeleton variant="text" width="50px" className="ml-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="py-12"
                >
                  <EmptyState
                    title={emptyTitle}
                    message={emptyMessage}
                    actionLabel={onCreateNew ? createLabel : undefined}
                    onAction={onCreateNew}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#F7F8F7]/60 transition-colors"
                >
                  {columns.map((col, cIdx) => {
                    let cellContent: React.ReactNode = null;
                    if (typeof col.accessor === 'function') {
                      cellContent = col.accessor(row);
                    } else if (col.accessor) {
                      const val = row[col.accessor];
                      if (col.accessor === 'status') {
                        cellContent = (
                          <Badge
                            variant={val === 'published' ? 'published' : 'draft'}
                            size="sm"
                          >
                            {String(val)}
                          </Badge>
                        );
                      } else {
                        cellContent = val !== undefined && val !== null ? String(val) : '—';
                      }
                    }
                    return (
                      <td
                        key={cIdx}
                        className={`py-3.5 px-4 text-[#202520] ${col.className || ''}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}

                  {(onEdit || onDelete) && (
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            title="Edit Record"
                            aria-label="Edit Record"
                            className="p-1.5 rounded text-[#585F5A] hover:text-[#43866A] hover:bg-[#EBF3EF] transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            title="Delete Record"
                            aria-label="Delete Record"
                            className="p-1.5 rounded text-[#585F5A] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && filteredData.length > 0 && (
        <div className="p-4 border-t border-[#E8ECE9] flex items-center justify-between text-xs text-[#777F79] bg-[#F7F8F7]/30">
          <span>
            Showing{' '}
            <strong className="text-[#202520]">
              {(currentPage - 1) * rowsPerPage + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-[#202520]">
              {Math.min(currentPage * rowsPerPage, filteredData.length)}
            </strong>{' '}
            of <strong className="text-[#202520]">{filteredData.length}</strong> entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-[#E8ECE9] rounded hover:bg-[#EFF2F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-[#202520]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-[#E8ECE9] rounded hover:bg-[#EFF2F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
