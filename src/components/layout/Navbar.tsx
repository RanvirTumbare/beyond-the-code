import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Certifications', path: '/certificates' },
  { label: 'Articles', path: '/diary' },
  { label: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { session, isAdmin } = useAuth();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const siteTitle = settings?.site_title || 'Beyond the Code';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E8ECE9] shadow-subtle py-3'
          : 'bg-white border-b border-[#E8ECE9]/60 py-4'
      }`}
    >
      <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43866A] rounded"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#202520] group-hover:text-[#43866A] transition-colors">
            {siteTitle}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#43866A] inline-block mb-1" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center space-x-1"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43866A] rounded ${
                  isActive
                    ? 'text-[#202520]'
                    : 'text-[#777F79] hover:text-[#202520]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#43866A] rounded-full animate-fade-in" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Action: subtle Login / Dashboard button */}
        <div className="hidden lg:flex items-center space-x-3">
          {session && isAdmin ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#43866A] bg-[#EBF3EF] border border-[#D1DFD8] px-3 py-1.5 rounded-full hover:bg-[#DDF0E6] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs text-[#777F79] hover:text-[#202520] px-2.5 py-1.5 rounded hover:bg-[#F7F8F7] transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {session && isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center text-xs text-[#43866A] bg-[#EBF3EF] px-2 py-1 rounded-full"
            >
              <ShieldCheck className="w-3 h-3" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 text-[#202520] hover:bg-[#F7F8F7] rounded-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43866A]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8ECE9] bg-white px-4 pt-3 pb-6 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-editorial text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EBF3EF] text-[#43866A]'
                      : 'text-[#202520] hover:bg-[#F7F8F7]'
                  }`
                }
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            ))}
            <div className="pt-3 mt-2 border-t border-[#E8ECE9]">
              {session && isAdmin ? (
                <Link
                  to="/admin"
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#43866A] bg-[#EBF3EF] rounded-editorial"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-between px-3 py-2 text-sm text-[#777F79] hover:text-[#202520]"
                >
                  <span>Admin Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

