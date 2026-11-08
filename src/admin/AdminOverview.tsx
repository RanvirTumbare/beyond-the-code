import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Award,
  BookOpen,
  Image,
  Mail,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useCertificates } from '@/hooks/useCertificates';
import { useDiary } from '@/hooks/useDiary';
import { useGallery } from '@/hooks/useGallery';
import { useMessages } from '@/hooks/useMessages';

export const AdminOverview: React.FC = () => {
  const { projects } = useProjects(true);
  const { certificates } = useCertificates(true);
  const { posts } = useDiary(true);
  const { items } = useGallery(true);
  const { messages, unreadCount } = useMessages();

  const stats = [
    {
      label: 'Projects',
      count: projects.length,
      detail: `${projects.filter((p) => p.status === 'published').length} published`,
      icon: Briefcase,
      link: '/admin/projects',
    },
    {
      label: 'Certificates',
      count: certificates.length,
      detail: `${certificates.filter((c) => !c.in_progress).length} completed`,
      icon: Award,
      link: '/admin/certificates',
    },
    {
      label: 'Diary Posts',
      count: posts.length,
      detail: `${posts.filter((p) => p.is_future_note).length} future letters`,
      icon: BookOpen,
      link: '/admin/diary',
    },
    {
      label: 'Gallery Assets',
      count: items.length,
      detail: `${items.filter((i) => i.status === 'published').length} published`,
      icon: Image,
      link: '/admin/gallery',
    },
    {
      label: 'Messages',
      count: messages.length,
      detail: `${unreadCount} unread`,
      icon: Mail,
      link: '/admin/messages',
      highlight: unreadCount > 0,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Top Banner */}
      <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A] inline-flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Editorial Dashboard
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Welcome to Beyond the Code Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1.5 max-w-xl leading-relaxed">
            Manage your personal narrative, projects, and digital diary. All updates directly reflect on the public site and are securely governed by PostgreSQL Row Level Security.
          </p>
        </div>

        {/* Quick Actions Menu */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#202520] text-white px-3.5 py-2 rounded-editorial hover:bg-black transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/diary"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#EBF3EF] text-[#43866A] border border-[#D1DFD8] px-3.5 py-2 rounded-editorial hover:bg-[#DDF0E6] transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Diary Entry</span>
          </Link>
        </div>
      </div>

      {/* Real Count Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              to={s.link}
              className={`group bg-white border rounded-editorial p-4 sm:p-5 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 ${
                s.highlight ? 'border-[#43866A]' : 'border-[#E8ECE9]'
              }`}
            >
              <div className="flex items-center justify-between text-[#777F79] group-hover:text-[#43866A] mb-3">
                <Icon className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
                {s.count}
              </p>
              <p className="text-xs font-semibold text-[#585F5A] mt-1">{s.label}</p>
              <p className="text-[11px] text-[#777F79] mt-0.5">{s.detail}</p>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Messages & Quick Short-Cuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Preview */}
        <div className="lg:col-span-2 bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8ECE9]">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#202520]">
                Recent Inquiries & Messages
              </h2>
              <p className="text-xs text-[#777F79]">
                Inquiries received through the public Contact page
              </p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs text-[#43866A] font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="text-xs text-[#777F79] py-8 text-center">
              No inquiries received yet. Send a test message from the Contact page!
            </p>
          ) : (
            <div className="divide-y divide-[#E8ECE9]">
              {messages.slice(0, 4).map((m) => (
                <div key={m.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#202520]">
                        {m.name}
                      </span>
                      {!m.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#43866A]" />
                      )}
                      <span className="text-[11px] text-[#777F79]">
                        &lt;{m.email}&gt;
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#585F5A] mt-0.5 truncate">
                      {m.subject}
                    </p>
                    <p className="text-xs text-[#777F79] line-clamp-1 mt-0.5">
                      {m.message}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#9CA39E] whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Studio Quick Shortcuts */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520]">
            Studio Sections
          </h2>
          <div className="space-y-2 text-xs">
            <Link
              to="/admin/homepage"
              className="flex items-center justify-between p-2.5 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] hover:bg-[#F7F8F7] transition-colors"
            >
              <span className="font-medium text-[#202520]">Homepage & Hero Content</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#777F79]" />
            </Link>
            <Link
              to="/admin/about"
              className="flex items-center justify-between p-2.5 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] hover:bg-[#F7F8F7] transition-colors"
            >
              <span className="font-medium text-[#202520]">About, Education & Skills</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#777F79]" />
            </Link>
            <Link
              to="/admin/journey"
              className="flex items-center justify-between p-2.5 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] hover:bg-[#F7F8F7] transition-colors"
            >
              <span className="font-medium text-[#202520]">Journey Milestones & Hackathons</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#777F79]" />
            </Link>
            <Link
              to="/admin/profile"
              className="flex items-center justify-between p-2.5 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] hover:bg-[#F7F8F7] transition-colors"
            >
              <span className="font-medium text-[#202520]">Resume PDF & Social Links</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#777F79]" />
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center justify-between p-2.5 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] hover:bg-[#F7F8F7] transition-colors"
            >
              <span className="font-medium text-[#202520]">SEO, Tagline & Accent Color</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#777F79]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
