import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Linkedin,
  Github,
  Mail,
  Globe,
  Sparkles,
  User,
  Award,
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

  // End-of-page interactive light effect state
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [bounceY, setBounceY] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerEndEffect = (strength = 6) => {
    setIsAtEnd(true);
    setBounceY(-Math.min(strength, 8)); // Subtle elastic lift

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Spring back quickly
    setTimeout(() => {
      setBounceY(0);
    }, 160);

    // Fade out light effect smoothly after 1.4s
    timeoutRef.current = setTimeout(() => {
      setIsAtEnd(false);
    }, 1400);
  };

  useEffect(() => {
    // Detect mouse wheel scroll down
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        triggerEndEffect(Math.min(Math.abs(e.deltaY) * 0.08, 8));
      }
    };

    // Detect touch swipe up (scroll down intent)
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const diff = touchStartY - e.touches[0].clientY;
      if (diff > 12) {
        triggerEndEffect(6);
      }
    };

    // Detect keyboard down arrows
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        triggerEndEffect(7);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>{settings.seo_default_title}</title>
        <meta name="description" content={settings.seo_default_description} />
        {settings.og_image_url && <meta property="og:image" content={settings.og_image_url} />}
      </Helmet>

      {/* Single Non-Scrollable Viewport Container with Relative Anchor for Light Effects */}
      <div className="relative w-full min-h-[calc(100vh-69px)] lg:h-[calc(100vh-69px)] flex flex-col justify-between bg-white lg:overflow-hidden select-none">
        {/* Main Hero Centerpiece with Elastic Spring Motion on Scroll */}
        <motion.div
          animate={{ y: bounceY }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="flex-1 flex items-center max-w-editorial w-full mx-auto px-4 sm:px-6 md:px-8 py-8 lg:py-0 select-text z-10"
        >
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

              {/* Call-to-Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link to="/projects">
                  <Button
                    variant="primary"
                    size="md"
                    className="sm:h-11 sm:px-5 bg-[#202520] hover:bg-[#141814] text-white shadow-sm dark:bg-[#2E3D34] dark:hover:bg-[#3B4E42] dark:border dark:border-[#43594B]"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View My Work
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="secondary"
                    size="md"
                    className="sm:h-11 sm:px-4 border-[#E8ECE9] hover:border-[#43866A] hover:text-[#43866A] transition-colors dark:border-[#2E3831] dark:bg-[#1A1F1C] dark:hover:border-[#52A684] dark:hover:text-[#52A684]"
                    leftIcon={<User className="w-4 h-4" />}
                  >
                    About Me
                  </Button>
                </Link>
                <Link to="/certificates">
                  <Button
                    variant="secondary"
                    size="md"
                    className="sm:h-11 sm:px-4 border-[#E8ECE9] hover:border-[#43866A] hover:text-[#43866A] transition-colors dark:border-[#2E3831] dark:bg-[#1A1F1C] dark:hover:border-[#52A684] dark:hover:text-[#52A684]"
                    leftIcon={<Award className="w-4 h-4" />}
                  >
                    View Certifications
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
        </motion.div>

        {/* Ambient Radial Green Light Bloom from Bottom (Brightens on Scroll Down) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl h-48 rounded-full bg-[#43866A]/20 blur-3xl transition-all duration-700 ease-out z-0 ${
            isAtEnd ? 'opacity-100 scale-105' : 'opacity-20 scale-95'
          }`}
        />

        {/* Floating "End of Page" Light Pill Indicator */}
        <div
          className={`absolute bottom-14 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-500 ease-out z-20 ${
            isAtEnd
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-3 scale-95'
          }`}
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D1DFD8] shadow-[0_4px_24px_rgba(67,134,106,0.22)] text-xs text-[#202520]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43866A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#43866A]" />
            </span>
            <span className="font-serif italic text-xs text-[#585F5A]">
              End of page
            </span>
            <span className="text-[#D1DFD8]">·</span>
            <Link
              to="/projects"
              className="pointer-events-auto font-medium text-[#43866A] hover:underline flex items-center gap-1 text-xs"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Minimal Single-Screen Bottom Footer Bar with Glowing Edge Light */}
        <div className="relative w-full border-t border-[#E8ECE9] bg-[#F7F8F7]/70 backdrop-blur-xs py-3 z-10 select-text">
          {/* Luminous Edge Line Light Effect */}
          <div
            aria-hidden="true"
            className={`absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#43866A] to-transparent transition-all duration-500 ease-out ${
              isAtEnd
                ? 'opacity-100 shadow-[0_0_14px_rgba(67,134,106,0.85)] scale-x-100'
                : 'opacity-30 shadow-none scale-x-75'
            }`}
          />

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
