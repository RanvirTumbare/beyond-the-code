import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Video,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageTransition } from '@/components/layout/PageTransition';
import { useProjects, useProjectDetail } from '@/hooks/useProjects';
import { Helmet } from 'react-helmet-async';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading, error } = useProjectDetail(slug || '');
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Screenshot Lightbox State
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="max-w-editorial mx-auto px-4 py-16 space-y-6">
        <Skeleton variant="text" width="120px" />
        <Skeleton variant="title" width="70%" />
        <Skeleton variant="rect" height="400px" />
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="font-serif text-2xl font-bold text-[#202520] mb-2">
          Project Case Study Not Found
        </h2>
        <p className="text-sm text-[#777F79] mb-6">
          The requested engineering study does not exist or has been unpublished.
        </p>
        <Link to="/projects">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  // Previous and Next Project Calculation
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex !== -1 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  // Video embed helper
  const renderVideoEmbed = (url: string) => {
    let embedSrc = url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedSrc = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedSrc = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
      embedSrc = `https://player.vimeo.com/video/${vimeoId}`;
    }

    return (
      <div className="aspect-video rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-subtle bg-black">
        <iframe
          src={embedSrc}
          title={`${project.title} Demo Video`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  // Side Index Items (filtered by non-empty sections)
  const navLinks = [
    { id: 'overview', label: 'Overview', show: Boolean(project.summary) },
    { id: 'problem', label: 'Problem & Context', show: Boolean(project.problem) },
    { id: 'why-selected', label: 'Why This Project', show: Boolean(project.why_selected) },
    { id: 'solution', label: 'Engineered Solution', show: Boolean(project.solution) },
    { id: 'features', label: 'Key Features', show: Boolean(project.features) },
    {
      id: 'screenshots',
      label: 'Screenshots & UI',
      show: Boolean(project.screenshots && project.screenshots.length > 0),
    },
    {
      id: 'contribution',
      label: 'Team & Contribution',
      show: Boolean(project.my_contribution || (project.team && project.team.length > 0)),
    },
    {
      id: 'challenges',
      label: 'Challenges & Learnings',
      show: Boolean(project.challenges || project.learnings),
    },
    { id: 'demo', label: 'Video Demo', show: Boolean(project.demo_video_url) },
  ].filter((item) => item.show);

  return (
    <PageTransition>
      <Helmet>
        <title>{project.seo_title || `${project.title} — Case Study by Ranvir`}</title>
        <meta
          name="description"
          content={project.seo_description || project.summary}
        />
        {project.cover_image_url && (
          <meta property="og:image" content={project.cover_image_url} />
        )}
      </Helmet>

      {/* Hero Header */}
      <div className="w-full bg-[#F7F8F7] border-b border-[#E8ECE9] py-12 md:py-16">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 space-y-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#43866A] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">{project.category}</Badge>
            <span className="text-xs text-[#777F79] font-mono">Case Study</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#202520] tracking-tight max-w-4xl leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#585F5A] max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Action Links & Tech Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8ECE9]">
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-[#202520] bg-white border border-[#E8ECE9] px-2.5 py-1 rounded-editorial"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#202520] bg-white border border-[#E8ECE9] px-3.5 py-2 rounded-editorial hover:bg-[#EFF2F0] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#43866A] px-3.5 py-2 rounded-editorial hover:bg-[#366E57] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Application</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image Banner */}
      {project.cover_image_url && (
        <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 -mt-6">
          <div className="aspect-[21/9] rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-card bg-black/5">
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* Main Content with Sticky Side-Index */}
      <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Desktop Sticky Index */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 p-4 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777F79] block mb-2">
                Study Index
              </span>
              <nav className="space-y-1 text-xs">
                {navLinks.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block px-2.5 py-1.5 text-[#585F5A] hover:text-[#43866A] hover:bg-white rounded transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Core Case Study Sections */}
          <div className="lg:col-span-9 space-y-12 leading-relaxed">
            {/* 1. Problem & Context */}
            {project.problem && (
              <section id="problem" className="scroll-mt-24 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  01. The Challenge
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  The Problem & Real-World Context
                </h2>
                <div className="p-5 bg-white border border-[#E8ECE9] rounded-editorial text-sm sm:text-base text-[#585F5A] leading-relaxed">
                  {project.problem}
                </div>
              </section>
            )}

            {/* 2. Why Selected */}
            {project.why_selected && (
              <section id="why-selected" className="scroll-mt-24 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  02. Motivation
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  Why I Selected This Project
                </h2>
                <p className="text-sm sm:text-base text-[#585F5A]">
                  {project.why_selected}
                </p>
              </section>
            )}

            {/* 3. The Solution */}
            {project.solution && (
              <section id="solution" className="scroll-mt-24 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  03. Architecture
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  Engineered Solution & Architecture
                </h2>
                <div className="p-6 bg-white border border-[#E8ECE9] rounded-editorial shadow-subtle text-sm sm:text-base text-[#585F5A] space-y-3">
                  <p>{project.solution}</p>
                </div>
              </section>
            )}

            {/* 4. Features */}
            {project.features && (
              <section id="features" className="scroll-mt-24 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  04. Capabilities
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  Key Features & Capabilities
                </h2>
                <div className="bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial p-6 space-y-2 text-sm text-[#585F5A]">
                  {project.features.split('\n').map((line, idx) => {
                    const cleanLine = line.replace(/^-\s*/, '').trim();
                    if (!cleanLine) return null;
                    return (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#43866A] flex-shrink-0 mt-0.5" />
                        <span>{cleanLine}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 5. Screenshot Gallery with Lightbox */}
            {project.screenshots && project.screenshots.length > 0 && (
              <section id="screenshots" className="scroll-mt-24 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  05. Interface Gallery
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  Screenshots & Interface
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.screenshots.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveScreenshotIdx(idx)}
                      className="group cursor-pointer rounded-editorial border border-[#E8ECE9] overflow-hidden bg-white shadow-subtle transition-all hover:shadow-card hover:border-[#43866A]"
                    >
                      <div className="aspect-video overflow-hidden bg-black/5 relative">
                        <img
                          src={s.url}
                          alt={s.caption || `Screenshot ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Maximize2 className="w-6 h-6" />
                        </div>
                      </div>
                      {s.caption && (
                        <p className="p-3 text-xs text-[#777F79] font-medium border-t border-[#E8ECE9] bg-[#F7F8F7]/50">
                          {s.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Team & My Contribution */}
            {(project.my_contribution || (project.team && project.team.length > 0)) && (
              <section id="contribution" className="scroll-mt-24 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  06. Collaboration
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  Team & Individual Contribution
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.my_contribution && (
                    <div className="bg-white border border-[#E8ECE9] rounded-editorial p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                        <Lightbulb className="w-4 h-4" />
                        <span>My Exact Contribution</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#585F5A] leading-relaxed">
                        {project.my_contribution}
                      </p>
                    </div>
                  )}

                  {project.team && project.team.length > 0 && (
                    <div className="bg-white border border-[#E8ECE9] rounded-editorial p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
                        <Users className="w-4 h-4" />
                        <span>Project Collaborators</span>
                      </div>
                      <ul className="divide-y divide-[#E8ECE9] text-xs">
                        {project.team.map((member, idx) => (
                          <li key={idx} className="py-2 flex items-center justify-between">
                            <span className="font-semibold text-[#202520]">
                              {member.name}
                            </span>
                            <span className="text-[#777F79]">{member.role}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 7. Challenges & Learnings */}
            {(project.challenges || project.learnings) && (
              <section id="challenges" className="scroll-mt-24 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  07. Post-Mortem
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  Engineering Challenges & Takeaways
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.challenges && (
                    <div className="bg-rose-50/40 border border-rose-200/60 rounded-editorial p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
                        <AlertCircle className="w-4 h-4" />
                        <span>Obstacles Overcome</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#585F5A] leading-relaxed">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {project.learnings && (
                    <div className="bg-[#EBF3EF]/40 border border-[#D1DFD8] rounded-editorial p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                        <Lightbulb className="w-4 h-4" />
                        <span>Key Insights</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#585F5A] leading-relaxed">
                        {project.learnings}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 8. Demo Video */}
            {project.demo_video_url && (
              <section id="demo" className="scroll-mt-24 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  08. Demonstration
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202520]">
                  Demonstration Video
                </h2>
                {renderVideoEmbed(project.demo_video_url)}
              </section>
            )}

            {/* Bottom Nav: Previous & Next Project */}
            <div className="pt-10 border-t border-[#E8ECE9] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevProject ? (
                <Link
                  to={`/projects/${prevProject.slug}`}
                  className="p-4 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] bg-white transition-colors group text-left"
                >
                  <span className="text-[10px] text-[#777F79] uppercase tracking-wider flex items-center gap-1 mb-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous Study
                  </span>
                  <p className="font-serif font-semibold text-sm text-[#202520] group-hover:text-[#43866A] transition-colors truncate">
                    {prevProject.title}
                  </p>
                </Link>
              ) : <div />}

              {nextProject ? (
                <Link
                  to={`/projects/${nextProject.slug}`}
                  className="p-4 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] bg-white transition-colors group text-right ml-auto w-full"
                >
                  <span className="text-[10px] text-[#777F79] uppercase tracking-wider flex items-center justify-end gap-1 mb-1">
                    Next Study <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <p className="font-serif font-semibold text-sm text-[#202520] group-hover:text-[#43866A] transition-colors truncate">
                    {nextProject.title}
                  </p>
                </Link>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Lightbox Modal */}
      {activeScreenshotIdx !== null && project.screenshots && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setActiveScreenshotIdx(null)}
        >
          <button
            onClick={() => setActiveScreenshotIdx(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={project.screenshots[activeScreenshotIdx]?.url}
              alt={project.screenshots[activeScreenshotIdx]?.caption || 'Full view'}
              className="max-w-full max-h-[75vh] object-contain rounded shadow-modal"
            />
            {project.screenshots[activeScreenshotIdx]?.caption && (
              <p className="text-sm text-white/80 mt-3 text-center">
                {project.screenshots[activeScreenshotIdx]?.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </PageTransition>
  );
};

