import React, { useState } from 'react';
import { Save, Settings, Sparkles, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/contexts/ToastContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Live preview accent color change in DOM
  const handleColorChange = (newColor: string) => {
    setFormData({ ...formData, accent_color: newColor });
    document.documentElement.style.setProperty('--accent-color', newColor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateSettings(formData);
    setIsSaving(false);

    if (res.success) {
      success('Site settings and SEO configurations saved.');
    } else {
      toastError(res.error || 'Failed to save settings.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
          Global Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
          Website & SEO Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-1">
          Configure site identity, default SEO meta tags, and the dynamic accent color.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Identity & Theme */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Brand Identity & Theme Accent
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Site Title"
              value={formData.site_title}
              onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5 flex items-center justify-between">
                <span>Theme Accent Color</span>
                <span className="font-mono text-[11px] text-[#43866A]">
                  {formData.accent_color}
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded border border-[#E8ECE9] cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  {['#43866A', '#2D6A4F', '#3B82F6', '#6366F1', '#4F46E5', '#0F172A'].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => handleColorChange(hex)}
                      style={{ backgroundColor: hex }}
                      className="w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform"
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Textarea
            label="Site Tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            rows={2}
            required
          />

          <ImageUploader
            label="Site Logo (Optional)"
            value={formData.logo_url}
            onChange={(url) => setFormData({ ...formData, logo_url: url })}
            folder="branding"
            aspectRatio="square"
          />
        </div>

        {/* Global SEO Defaults */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Default SEO & Social Card (Open Graph)
          </h2>
          <p className="text-xs text-[#777F79]">
            These fallback meta tags are applied across all public pages when item-specific overrides are absent.
          </p>

          <Input
            label="Default Browser Tab / SEO Title"
            value={formData.seo_default_title}
            onChange={(e) =>
              setFormData({ ...formData, seo_default_title: e.target.value })
            }
            required
          />

          <Textarea
            label="Default SEO Meta Description"
            value={formData.seo_default_description}
            onChange={(e) =>
              setFormData({ ...formData, seo_default_description: e.target.value })
            }
            rows={3}
            required
          />

          <ImageUploader
            label="Social Share Image (Open Graph)"
            value={formData.og_image_url}
            onChange={(url) => setFormData({ ...formData, og_image_url: url })}
            folder="seo"
            aspectRatio="wide"
            helperText="Recommended dimension: 1200x630px. Previewed when links are shared on LinkedIn and Twitter."
          />
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
            Save Website Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
