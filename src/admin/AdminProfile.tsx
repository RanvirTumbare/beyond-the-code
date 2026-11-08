import React, { useState } from 'react';
import {
  Save,
  FileText,
  Upload,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Linkedin,
  Github,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/contexts/ToastContext';
import { uploadMediaFile } from '@/lib/storage';

export const AdminProfile: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState(settings.email);
  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedin_url);
  const [githubUrl, setGithubUrl] = useState(settings.github_url);
  const [resumeUrl, setResumeUrl] = useState(settings.resume_url);
  const [otherLinks, setOtherLinks] = useState(settings.other_links || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  React.useEffect(() => {
    setEmail(settings.email);
    setLinkedinUrl(settings.linkedin_url);
    setGithubUrl(settings.github_url);
    setResumeUrl(settings.resume_url);
    setOtherLinks(settings.other_links || []);
  }, [settings]);

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    try {
      const res = await uploadMediaFile(file, 'resume');
      if (res.url) {
        setResumeUrl(res.url);
        success('Resume uploaded successfully.');
      } else {
        toastError(res.error || 'Failed to upload resume.');
      }
    } catch {
      toastError('Resume upload error');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleAddLink = () => {
    setOtherLinks([...otherLinks, { label: 'Platform', url: 'https://' }]);
  };

  const handleRemoveLink = (idx: number) => {
    setOtherLinks(otherLinks.filter((_, i) => i !== idx));
  };

  const handleLinkChange = (idx: number, key: 'label' | 'url', val: string) => {
    setOtherLinks(
      otherLinks.map((item, i) => (i === idx ? { ...item, [key]: val } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateSettings({
      email: email.trim(),
      linkedin_url: linkedinUrl.trim(),
      github_url: githubUrl.trim(),
      resume_url: resumeUrl,
      other_links: otherLinks.filter((l) => l.label && l.url),
    });

    setIsSaving(false);
    if (res.success) {
      success('Profile & Social information saved.');
    } else {
      toastError(res.error || 'Failed to update profile settings.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
          Identity & Documents
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
          Resume & Social Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-1">
          Manage your primary correspondence email, social channels, and official resume PDF.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Resume Document */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8ECE9]">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#202520]">
                Curriculum Vitae (PDF)
              </h2>
              <p className="text-xs text-[#777F79]">
                Visitors can download this PDF via the "Download Resume" buttons on the site.
              </p>
            </div>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#43866A] font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Current PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="p-4 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-editorial bg-[#EBF3EF] text-[#43866A] flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#202520] truncate">
                  {resumeUrl ? 'Active Resume Document Linked' : 'No Resume Uploaded'}
                </p>
                <p className="text-[11px] text-[#777F79] truncate max-w-md font-mono">
                  {resumeUrl || 'Upload a PDF file to enable instant downloads'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-[#202520] bg-white border border-[#E8ECE9] hover:bg-[#EFF2F0] px-3.5 py-2 rounded-editorial transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{resumeUrl ? 'Replace PDF' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleResumeFileUpload}
                  disabled={isUploadingResume}
                />
              </label>

              {resumeUrl && (
                <button
                  type="button"
                  onClick={() => setResumeUrl(null)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded"
                  title="Remove resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Contact Email & Primary Socials */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Primary Channels
          </h2>

          <div className="space-y-4">
            <Input
              label="Contact Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="LinkedIn Profile URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              leftIcon={<Linkedin className="w-4 h-4" />}
              required
            />
            <Input
              label="GitHub Profile URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              leftIcon={<Github className="w-4 h-4" />}
              required
            />
          </div>
        </div>

        {/* Section 3: Other Portfolio / Profile Links */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8ECE9]">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#202520]">
                Additional Platforms & Profiles
              </h2>
              <p className="text-xs text-[#777F79]">
                Add links to Kaggle, LeetCode, personal blogs, or technical profiles.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLink}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Link
            </Button>
          </div>

          <div className="space-y-3">
            {otherLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial"
              >
                <div className="w-full sm:w-44">
                  <input
                    type="text"
                    placeholder="Platform Label (e.g. Kaggle)"
                    value={link.label}
                    onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                    className="w-full bg-white text-xs p-2 border border-[#E8ECE9] rounded"
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                    className="w-full bg-white text-xs p-2 border border-[#E8ECE9] rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  title="Remove link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {otherLinks.length === 0 && (
              <p className="text-xs text-[#9CA39E] italic py-2 text-center">
                No additional platform links configured.
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile & Resume
          </Button>
        </div>
      </form>
    </div>
  );
};

