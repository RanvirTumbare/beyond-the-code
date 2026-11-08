import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Linkedin,
  Github,
  Mail,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Helmet } from 'react-helmet-async';

export const Home: React.FC = () => {
  const { content } = useHomeContent();
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <PageTransition>
      <Helmet>
        <title>{settings.seo_default_title}</title>
        <meta name="description" content={settings.seo_default_description} />
        {settings.og_image_url && <meta property="og:image" content={settings.og_image_url} />}
      </Helmet>

      {/* Single Non-Scrollable Viewport Container */}
      <div className="w-full min-h-[calc(100vh-69px)] lg:h-[calc(100vh-69px)] flex flex-col justify-between bg-white lg:overflow-hidden">
        {/* Main Hero Centerpiece */}
        <div className="flex-1 flex items-center max-w-editorial w-full mx-auto px-4 sm:px-6 md:px-8 py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
            {/* Left Column: Headline, Bio & View My Work Button */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EF] border border-[#D1DFD8] text-xs font-semibold text-[#43866A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43866A] animate-pulse" />
                <span>{content.hero_greeting}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#202520] tracking-tight leading-[1.15]">
                {content.hero_heading}
              </h1>

              <p className="text-base sm:text-lg text-[#777F79] max-w-xl leading-relaxed">
                {content.hero_intro}
              </p>

              {/* Only 'View My Work' button */}
              <div className="pt-2 flex items-center">
                <Link to="/projects">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-[#202520] hover:bg-[#141814] text-white shadow-sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View My Work
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Portrait Photo & Floating Status Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-[340px] lg:max-w-[360px]">
                {/* Photo Frame */}
                <div className="aspect-[4/5] rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-card bg-[#F7F8F7]">
                  <img
                    src={
                      content.hero_image_url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                    }
                    alt="Ranvir — Portrait"
                    className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                    loading="eager"
                  />
                </div>

                {/* Floating Status Card */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-[#E8ECE9] rounded-editorial p-3.5 sm:p-4 shadow-modal max-w-[260px] sm:max-w-[280px]">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#43866A] mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#43866A]" />
                    <span>Current Focus</span>
                  </div>
                  <p className="text-xs font-medium text-[#202520] leading-snug">
                    {content.status_text}
                  </p>
                  <div className="mt-2 pt-2 border-t border-[#E8ECE9] flex items-center gap-1 text-[11px] text-[#777F79]">
                    <MapPin className="w-3 h-3 text-[#43866A]" />
                    <span>{content.location_label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Single-Screen Bottom Footer Bar */}
        <div className="w-full border-t border-[#E8ECE9] bg-[#F7F8F7]/60 py-3">
          <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777F79] gap-3">
            <p>© {currentYear} Ranvir</p>

            <div className="flex items-center gap-3">
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="text-[#777F79] hover:text-[#43866A] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="text-[#777F79] hover:text-[#43866A] transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  aria-label="Send Email"
                  className="text-[#777F79] hover:text-[#43866A] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {settings.other_links?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  aria-label={link.label}
                  className="text-[#777F79] hover:text-[#43866A] transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
