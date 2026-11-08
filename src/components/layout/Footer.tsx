import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Mail, Globe, ArrowUp } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();
  const siteTitle = settings?.site_title || 'Beyond the Code';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Certifications', path: '/certificates' },
    { label: 'Articles', path: '/diary' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="w-full bg-[#F7F8F7] border-t border-[#E8ECE9] mt-auto">
      <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E8ECE9]">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-1.5">
            <span className="font-serif text-xl font-bold tracking-tight text-[#202520]">
              {siteTitle}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#43866A]" />
          </Link>

          {/* Nav links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#585F5A]">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-[#202520] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {settings?.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="w-8 h-8 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {settings?.github_url && (
              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="w-8 h-8 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                aria-label="Send email"
                className="w-8 h-8 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
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
                className="w-8 h-8 rounded-editorial bg-white border border-[#E8ECE9] flex items-center justify-center text-[#585F5A] hover:text-[#43866A] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777F79] gap-3">
          <p>© {currentYear} Ranvir. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-[#777F79] hover:text-[#202520] transition-colors text-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
