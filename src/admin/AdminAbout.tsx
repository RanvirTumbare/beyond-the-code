import React, { useState } from 'react';
import {
  Save,
  Plus,
  Trash2,
  GraduationCap,
  Sparkles,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { useAboutContent } from '@/hooks/useAboutContent';
import { useToast } from '@/contexts/ToastContext';
import { EducationItem, Skill } from '@/lib/types';

export const AdminAbout: React.FC = () => {
  const {
    about,
    skills,
    updateAboutContent,
    addSkill,
    deleteSkill,
  } = useAboutContent();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(about);
  const [isSaving, setIsSaving] = useState(false);

  // New Skill State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Cybersecurity');
  const [newSkillLevel, setNewSkillLevel] = useState('Core Proficient');

  // Delete Skill confirmation dialog
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  React.useEffect(() => {
    setFormData(about);
  }, [about]);

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateAboutContent(formData);
    setIsSaving(false);
    if (res.success) {
      success('About narrative and education details saved.');
    } else {
      toastError(res.error || 'Failed to save about content.');
    }
  };

  // Education item management
  const handleAddEducation = () => {
    const newItem: EducationItem = {
      degree: 'Degree Title (e.g. B.Tech)',
      institution: 'University / College Name',
      period: '2022 — 2026',
      details: 'Relevant coursework and focus.',
    };
    setFormData({
      ...formData,
      education: [...(formData.education || []), newItem],
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = formData.education.filter((_, idx) => idx !== index);
    setFormData({ ...formData, education: updated });
  };

  const handleEducationChange = (index: number, key: keyof EducationItem, val: string) => {
    const updated = formData.education.map((item, idx) =>
      idx === index ? { ...item, [key]: val } : item
    );
    setFormData({ ...formData, education: updated });
  };

  // Skill management
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      toastError('Please enter a skill name.');
      return;
    }
    const res = await addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      sort_order: skills.length + 1,
    });
    if (res.success) {
      success(`Added skill "${newSkillName.trim()}".`);
      setNewSkillName('');
    } else {
      toastError(res.error || 'Failed to add skill.');
    }
  };

  const confirmDeleteSkill = async () => {
    if (!skillToDelete) return;
    const res = await deleteSkill(skillToDelete.id);
    if (res.success) {
      success(`Deleted skill "${skillToDelete.name}".`);
    } else {
      toastError('Failed to delete skill.');
    }
    setSkillToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
          Narrative & Toolkit
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
          About & Skills Management
        </h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-1">
          Manage your personal introduction, educational milestones, and technical skillset.
        </p>
      </div>

      {/* Main Narrative Form */}
      <form onSubmit={handleSaveAbout} className="space-y-6">
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Personal Narrative & Philosophy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Textarea
                label="Primary Introduction"
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                rows={4}
                required
              />
              <Textarea
                label="Engineering Approach"
                value={formData.approach}
                onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                rows={3}
                required
              />
              <Textarea
                label="Personality & Values"
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="Profile Photo"
                value={formData.photo_url}
                onChange={(url) => setFormData({ ...formData, photo_url: url })}
                aspectRatio="square"
                folder="profile"
              />
              <Textarea
                label="Future Aspirations"
                value={formData.aspirations}
                onChange={(e) => setFormData({ ...formData, aspirations: e.target.value })}
                rows={3}
                required
              />
              <Textarea
                label="Beyond Technology"
                value={formData.beyond_technology}
                onChange={(e) =>
                  setFormData({ ...formData, beyond_technology: e.target.value })
                }
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Education Timeline Manager */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8ECE9]">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#202520]">
                Academic Milestones & Education
              </h2>
              <p className="text-xs text-[#777F79]">
                Structured educational institutions, degrees, and coursework details.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddEducation}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Education Record
            </Button>
          </div>

          <div className="space-y-4">
            {formData.education?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#43866A]">
                    Record #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Degree / Certificate Title"
                    value={item.degree}
                    onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                    required
                  />
                  <Input
                    label="Institution Name"
                    value={item.institution}
                    onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                    required
                  />
                  <Input
                    label="Period / Years"
                    value={item.period}
                    onChange={(e) => handleEducationChange(idx, 'period', e.target.value)}
                    placeholder="2022 — 2026"
                    required
                  />
                  <Input
                    label="GPA / Grade (Optional)"
                    value={item.score || ''}
                    onChange={(e) => handleEducationChange(idx, 'score', e.target.value)}
                    placeholder="e.g. Current GPA: 8.8 / 10.0"
                  />
                </div>

                <Textarea
                  label="Coursework / Details"
                  value={item.details}
                  onChange={(e) => handleEducationChange(idx, 'details', e.target.value)}
                  rows={2}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save About & Education
          </Button>
        </div>
      </form>

      {/* Skills Manager */}
      <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-6">
        <div className="pb-2 border-b border-[#E8ECE9]">
          <h2 className="font-serif text-lg font-semibold text-[#202520]">
            Skills & Competency Toolkit
          </h2>
          <p className="text-xs text-[#777F79]">
            Add or remove technical skills grouped by category. Text labels only (no fake percentage bars).
          </p>
        </div>

        {/* Add Skill Bar */}
        <form
          onSubmit={handleAddSkill}
          className="p-4 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial flex flex-col sm:flex-row items-end gap-3"
        >
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
              Skill Name
            </label>
            <input
              type="text"
              placeholder="e.g. Identity & Access Management (IAM)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full bg-white text-xs sm:text-sm p-2 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-44 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
              Category
            </label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as Skill['category'])}
              className="w-full bg-white text-xs sm:text-sm p-2 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
            >
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="SAP / ERP">SAP / ERP</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Web Development">Web Development</option>
              <option value="Programming & Tools">Programming & Tools</option>
            </select>
          </div>

          <div className="w-full sm:w-40 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
              Proficiency Label
            </label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-full bg-white text-xs sm:text-sm p-2 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
            >
              <option value="Core Proficient">Core Proficient</option>
              <option value="Working Knowledge">Working Knowledge</option>
              <option value="Familiar">Familiar</option>
              <option value="Exploring">Exploring</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="w-full sm:w-auto h-9"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Skill
          </Button>
        </form>

        {/* Existing Skills List */}
        <div className="space-y-4">
          {(
            [
              'Cybersecurity',
              'SAP / ERP',
              'Data Analytics',
              'Web Development',
              'Programming & Tools',
            ] as const
          ).map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <div key={cat} className="space-y-2">
                <h4 className="text-xs font-semibold text-[#585F5A] uppercase tracking-wider">
                  {cat} ({catSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-2 bg-white border border-[#E8ECE9] pl-3 pr-2 py-1.5 rounded-editorial text-xs shadow-xs"
                    >
                      <span className="font-medium text-[#202520]">{skill.name}</span>
                      <span className="text-[10px] text-[#43866A] bg-[#EBF3EF] px-1.5 py-0.5 rounded font-semibold uppercase">
                        {skill.level}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSkillToDelete(skill)}
                        aria-label={`Delete ${skill.name}`}
                        className="text-[#9CA39E] hover:text-rose-600 p-0.5 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {catSkills.length === 0 && (
                    <span className="text-xs text-[#9CA39E] italic">
                      No skills added in this category yet.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Skill Deletion */}
      <ConfirmDialog
        isOpen={Boolean(skillToDelete)}
        onClose={() => setSkillToDelete(null)}
        onConfirm={confirmDeleteSkill}
        title="Remove Skill"
        message={`Are you sure you want to remove "${skillToDelete?.name}" from your skills list?`}
      />
    </div>
  );
};
