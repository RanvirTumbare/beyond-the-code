import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Mail, Globe, ArrowUp } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  const currentYear = new Date().getFullYear();
  const siteTitle = settings?.site_title || 'Beyond the Code';
  const tagline =
    settings?.tagline ||
    'A personal portfolio and digital diary exploring Cybersecurity, SAP/ERP, Data Analytics and Web Engineering.';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#F7F8F7] border-t border-[#E8ECE9] mt-auto">
      <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Logo & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#202520]">
                {siteTitle}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#43866A] inline-block" />
            </Link>
            <p className="text-sm text-[#777F79] max-w-sm leading-relaxed">
              {tagline}
            </p>
            <div className="pt-2 flex items-center gap-3">
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="w-9 h-9 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] hover:border-[#43866A] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="w-9 h-9 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] hover:border-[#43866A] transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  aria-label="Send email"
                  className="w-9 h-9 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] hover:border-[#43866A] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {settings?.other_links?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  aria-label={link.label}
                  className="w-9 h-9 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] hover:border-[#43866A] transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#202520]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link to="/journey" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  Journey Timeline
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  Project Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Exploration & Journal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#202520]">
              Journal & Proof
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/certificates" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  Certifications
                </Link>
              </li>
              <li>
                <Link to="/diary" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  Digital Diary
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  Visual Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#777F79] hover:text-[#202520] transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-12 pt-6 border-t border-[#E8ECE9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#777F79] gap-4">
          <p>© {currentYear} Ranvir. All rights reserved. Designed with editorial simplicity.</p>
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="inline-flex items-center gap-1.5 hover:text-[#202520] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

