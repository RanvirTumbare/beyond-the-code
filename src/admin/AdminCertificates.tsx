import React, { useState } from 'react';
import { Plus, Award, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/admin/components/DataTable';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { DraftPublishedToggle } from '@/admin/components/DraftPublishedToggle';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { useCertificates } from '@/hooks/useCertificates';
import { useToast } from '@/contexts/ToastContext';
import { Certificate, PublishStatus } from '@/lib/types';

export const AdminCertificates: React.FC = () => {
  const { certificates, loading, saveCertificate, deleteCertificate } = useCertificates(true);
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [completionDate, setCompletionDate] = useState<string>('');
  const [category, setCategory] = useState('Cybersecurity');
  const [skillsInput, setSkillsInput] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf'>('image');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [status, setStatus] = useState<PublishStatus>('published');

  // Delete State
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);

  const resetForm = () => {
    setEditingId(undefined);
    setTitle('');
    setIssuer('');
    setCompletionDate('');
    setCategory('Cybersecurity');
    setSkillsInput('');
    setFileUrl(null);
    setFileType('image');
    setVerificationUrl('');
    setInProgress(false);
    setStatus('published');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setCompletionDate(cert.completion_date || '');
    setCategory(cert.category);
    setSkillsInput(cert.skills.join(', '));
    setFileUrl(cert.file_url);
    setFileType(cert.file_type);
    setVerificationUrl(cert.verification_url || '');
    setInProgress(cert.in_progress);
    setStatus(cert.status);
    setIsModalOpen(true);
  };

  const handleFileChange = (url: string | null) => {
    setFileUrl(url);
    if (url) {
      if (url.toLowerCase().endsWith('.pdf') || url.includes('application/pdf')) {
        setFileType('pdf');
      } else {
        setFileType('image');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      toastError('Please fill in title and issuer.');
      return;
    }

    setIsSaving(true);
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Certificate> = {
      title: title.trim(),
      issuer: issuer.trim(),
      completion_date: inProgress ? null : completionDate || null,
      category,
      skills,
      file_url: fileUrl,
      file_type: fileType,
      verification_url: verificationUrl.trim() || null,
      in_progress: inProgress,
      status,
    };

    const res = await saveCertificate(payload, editingId);
    setIsSaving(false);

    if (res.success) {
      success(editingId ? 'Certificate updated.' : 'Certificate saved.');
      setIsModalOpen(false);
      resetForm();
    } else {
      toastError(res.error || 'Failed to save certificate.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!certToDelete) return;
    const res = await deleteCertificate(certToDelete.id);
    if (res.success) {
      success('Certificate removed.');
    } else {
      toastError('Failed to delete certificate.');
    }
    setCertToDelete(null);
  };

  const columns: Column<Certificate>[] = [
    {
      header: 'Certificate Title & Issuer',
      accessor: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#202520]">{row.title}</span>
            {row.in_progress && (
              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                In Progress
              </span>
            )}
          </div>
          <span className="text-xs text-[#777F79]">{row.issuer}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Completion Date',
      accessor: (row) => (
        <span className="font-mono text-xs">
          {row.in_progress ? 'In Progress' : row.completion_date || '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Credential Studio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Certifications & Coursework
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Maintain verified credentials, in-progress preparation tracks, and document scans.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Certificate
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={certificates}
        columns={columns}
        searchPlaceholder="Search certificates..."
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={(c) => setCertToDelete(c)}
        onCreateNew={handleOpenCreate}
        createLabel="Add Certificate"
      />

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Certificate' : 'Add New Certificate'}
        subtitle="Upload document image/PDF, assign skill tags, and enter verification links."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <DraftPublishedToggle status={status} onChange={setStatus} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Certificate / Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Google Cybersecurity Professional Certificate"
              required
            />
            <Input
              label="Issuing Organization"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Google / Coursera / SAP SE"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-sm p-2.5 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
              >
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="SAP / ERP">SAP / ERP</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Web Development">Web Development</option>
                <option value="Cloud & Systems">Cloud & Systems</option>
              </select>
            </div>

            <Input
              label="Completion Date"
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              disabled={inProgress}
            />

            <label className="flex items-center gap-2 p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer self-end">
              <input
                type="checkbox"
                checked={inProgress}
                onChange={(e) => setInProgress(e.target.checked)}
                className="w-4 h-4 accent-[#43866A]"
              />
              <span className="text-xs font-medium text-[#202520]">
                Course In Progress
              </span>
            </label>
          </div>

          <Input
            label="Validated Skills (Comma-separated)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="SIEM Tools, Python, Packet Analysis, Linux CLI"
          />

          <ImageUploader
            label="Certificate File (Image or PDF)"
            value={fileUrl}
            onChange={handleFileChange}
            folder="certificates"
            helperText="Supports PNG, JPG, or PDF. Auto-detected."
            aspectRatio="video"
          />

          <Input
            label="Online Verification URL"
            value={verificationUrl}
            onChange={(e) => setVerificationUrl(e.target.value)}
            placeholder="https://coursera.org/verify/..."
            helperText="Direct link where visitors can verify this credential."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8ECE9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Save Certificate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(certToDelete)}
        onClose={() => setCertToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Certificate"
        message={`Are you sure you want to remove "${certToDelete?.title}"?`}
      />
    </div>
  );
};

