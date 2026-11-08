import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  User,
  Milestone,
  Briefcase,
  Award,
  BookOpen,
  Image,
  Mail,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/hooks/useMessages';
import { useToast } from '@/contexts/ToastContext';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { unreadCount } = useMessages();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    success('Logged out successfully.');
    navigate('/login');
  };

  const navItems: SidebarItem[] = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Homepage', path: '/admin/homepage', icon: Home },
    { label: 'About & Skills', path: '/admin/about', icon: User },
    { label: 'Journey', path: '/admin/journey', icon: Milestone },
    { label: 'Projects', path: '/admin/projects', icon: Briefcase },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Diary', path: '/admin/diary', icon: BookOpen },
    { label: 'Gallery', path: '/admin/gallery', icon: Image },
    {
      label: 'Messages',
      path: '/admin/messages',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Resume & Profile', path: '/admin/profile', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F7] flex flex-col lg:flex-row text-[#202520]">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-[#E8ECE9] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle admin sidebar"
            className="p-1.5 rounded text-[#202520] hover:bg-[#F7F8F7]"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-lg text-[#202520]">
            Admin Studio
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#585F5A] hover:text-[#43866A] inline-flex items-center gap-1 bg-[#F7F8F7] px-2.5 py-1 rounded"
          >
            <span>View Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="p-1.5 text-[#777F79] hover:text-rose-600 rounded"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Sidebar Drawer Backdrop on Mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8ECE9] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-modal' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-6 border-b border-[#E8ECE9] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-editorial bg-[#EBF3EF] text-[#43866A] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight text-[#202520] block">
                Beyond the Code
              </span>
              <span className="text-[10px] text-[#777F79] uppercase tracking-wider block">
                Editorial CMS
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden p-1 text-[#777F79] hover:text-[#202520]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-editorial text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EBF3EF] text-[#43866A]'
                      : 'text-[#585F5A] hover:bg-[#F7F8F7] hover:text-[#202520]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-[#43866A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#E8ECE9] bg-[#F7F8F7]/50">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-[#202520] truncate">
                Ranvir (Admin)
              </p>
              <p className="text-[11px] text-[#777F79] truncate">
                {user?.email || 'admin@beyondthecode.local'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs text-[#202520] bg-white border border-[#E8ECE9] py-1.5 rounded-editorial hover:bg-[#EFF2F0] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-[#777F79]" />
            </Link>
            <button
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-editorial transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
};
