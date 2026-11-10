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
import { CategorySelect } from '@/admin/components/CategorySelect';
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
      degree: 'Degree Title (e.g. B.Tech in Computer Engineering)',
      institution: 'University / Institute Name',
      period: '2022 — 2026',
      details: 'Core subjects and specialization.',
      score: 'GPA: 8.8 / 10.0',
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

  const handleConfirmDeleteSkill = async () => {
    if (!skillToDelete) return;
    const res = await deleteSkill(skillToDelete.id);
    if (res.success) {
      success(`Deleted skill "${skillToDelete.name}".`);
    } else {
      toastError('Failed to remove skill.');
    }
    setSkillToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
          About Studio
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
          About & Skills Management
        </h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-1">
          Manage your biography, education records, and categorized technical skills.
        </p>
      </div>

      {/* Main Narrative Form */}
      <form onSubmit={handleSaveAbout} className="space-y-6">
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Bio & Portrait Photo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <ImageUploader
                label="Profile Portrait"
                value={formData.photo_url}
                onChange={(url) => setFormData({ ...formData, photo_url: url })}
                aspectRatio="square"
                folder="profile"
              />
            </div>

            <div className="md:col-span-8 space-y-4">
              <Textarea
                label="Primary Introduction"
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                rows={4}
                helperText="Appears prominently at the top of your About page."
                required
              />

              <Textarea
                label="Interests & Focus Areas"
                value={formData.interests || ''}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                rows={3}
                helperText="Technical focus areas (Cybersecurity, SAP/ERP, Data Analytics, Web Engineering)."
              />
            </div>
          </div>
        </div>

        {/* Education Timeline Manager */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8ECE9]">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#202520]">
                Education Records
              </h2>
              <p className="text-xs text-[#777F79]">
                Academic degrees, institutions, duration, and GPA.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddEducation}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Record
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
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Degree / Certificate"
                    value={item.degree}
                    onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                    required
                  />
                  <Input
                    label="Institution / University"
                    value={item.institution}
                    onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Time Period"
                    value={item.period}
                    onChange={(e) => handleEducationChange(idx, 'period', e.target.value)}
                    placeholder="2022 — 2026"
                    required
                  />
                  <Input
                    label="Score / GPA (Optional)"
                    value={item.score || ''}
                    onChange={(e) => handleEducationChange(idx, 'score', e.target.value)}
                    placeholder="GPA: 8.8 / 10.0"
                  />
                </div>

                <Textarea
                  label="Coursework / Details"
                  value={item.details || ''}
                  onChange={(e) => handleEducationChange(idx, 'details', e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save About Changes
          </Button>
        </div>
      </form>

      {/* Skills Manager */}
      <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-6">
        <div className="pb-3 border-b border-[#E8ECE9]">
          <h2 className="font-serif text-lg font-semibold text-[#202520]">
            Technical Skills ({skills.length})
          </h2>
          <p className="text-xs text-[#777F79]">
            Manage technical proficiencies categorized by discipline.
          </p>
        </div>

        {/* Add Skill Form */}
        <form
          onSubmit={handleAddSkill}
          className="p-4 border border-[#D1DFD8] bg-[#EBF3EF]/40 rounded-editorial grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
        >
          <div className="sm:col-span-4">
            <Input
              label="Skill Name"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Wireshark, Docker, SAP ABAP"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <CategorySelect
              label="Category"
              value={newSkillCategory}
              onChange={setNewSkillCategory}
              defaultOptions={[
                'Cybersecurity',
                'SAP / ERP',
                'Data Analytics',
                'Web Development',
                'Programming & Tools',
              ]}
              existingItems={skills}
              placeholder="e.g. Artificial Intelligence, Cloud..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5">
              Level
            </label>
            <input
              type="text"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              placeholder="Proficient / Familiar"
              className="w-full bg-white text-xs px-3 py-2 border border-[#E8ECE9] rounded-editorial focus:outline-none focus:ring-1 focus:ring-[#43866A]"
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>
        </form>

        {/* Skills List by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Cybersecurity',
            'SAP / ERP',
            'Data Analytics',
            'Web Development',
            'Programming & Tools',
          ].map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <div
                key={cat}
                className="p-4 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 space-y-2"
              >
                <span className="text-xs font-semibold text-[#202520] block">
                  {cat} ({catSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {catSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 bg-white border border-[#E8ECE9] px-2.5 py-1 rounded text-xs"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => setSkillToDelete(skill)}
                        aria-label={`Delete ${skill.name}`}
                        className="text-[#9CA39E] hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {catSkills.length === 0 && (
                    <span className="text-xs text-[#9CA39E] italic">
                      No skills added yet
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Skill Confirm */}
      <ConfirmDialog
        isOpen={Boolean(skillToDelete)}
        onClose={() => setSkillToDelete(null)}
        onConfirm={handleConfirmDeleteSkill}
        title="Remove Skill"
        message={`Are you sure you want to remove "${skillToDelete?.name}"?`}
        confirmLabel="Remove"
        isDestructive={true}
      />
    </div>
  );
};
