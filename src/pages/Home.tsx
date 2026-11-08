import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Layers,
  BarChart3,
  Code2,
  Calendar,
  Sparkles,
  MapPin,
  ExternalLink,
  BookOpen,
  Award,
  Linkedin,
  Github,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/layout/PageTransition';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useProjects } from '@/hooks/useProjects';
import { useDiary } from '@/hooks/useDiary';
import { useCertificates } from '@/hooks/useCertificates';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Helmet } from 'react-helmet-async';

// Icon map for dynamic explore card icons
const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Layers,
  BarChart3,
  Code2,
  Sparkles,
};

export const Home: React.FC = () => {
  const { content, exploreCards, loading: homeLoading } = useHomeContent();
  const { projects } = useProjects();
  const { posts } = useDiary();
  const { certificates } = useCertificates();
  const { settings } = useSiteSettings();

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const recentPosts = posts.slice(0, 3);
  const recentCerts = certificates.slice(0, 3);
  const visibleCards = exploreCards.filter((c) => c.visible);

  return (
    <PageTransition>
      <Helmet>
        <title>{settings.seo_default_title}</title>
        <meta name="description" content={settings.seo_default_description} />
        {settings.og_image_url && <meta property="og:image" content={settings.og_image_url} />}
      </Helmet>

      {/* 1. HERO SECTION */}
      <Section size="xl" background="white" className="border-b border-[#E8ECE9]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
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

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/journey">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore My Journey
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" size="lg">
                  View My Work
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Portrait Photo & Floating Status Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Photo Frame */}
              <div className="aspect-[4/5] rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-card bg-[#F7F8F7]">
                <img
                  src={
                    content.hero_image_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Ranvir — Portrait"
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500"
                  loading="eager"
                />
              </div>

              {/* Status Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-[#E8ECE9] rounded-editorial p-4 shadow-modal max-w-[280px]">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#43866A] mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#43866A]" />
                  <span>Current Focus</span>
                </div>
                <p className="text-xs font-medium text-[#202520] leading-snug">
                  {content.status_text}
                </p>
                <div className="mt-2 pt-2 border-t border-[#E8ECE9] flex items-center gap-1.5 text-[11px] text-[#777F79]">
                  <MapPin className="w-3 h-3 text-[#43866A]" />
                  <span>{content.location_label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. INTRO STRIP */}
      <section className="w-full bg-[#F7F8F7] border-b border-[#E8ECE9] py-8">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg sm:text-xl text-[#202520] text-center sm:text-left">
            "More than just a student. A curious learner building for the real world."
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#43866A] hover:text-[#366E57] hover:underline whitespace-nowrap"
          >
            <span>Read My Philosophy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. WHAT I EXPLORE */}
      {content.show_explore && visibleCards.length > 0 && (
        <Section size="lg" background="white" className="border-b border-[#E8ECE9]">
          <SectionHeading
            label="Domain Focus"
            title="What I Explore"
            subtitle="My core areas of technical inquiry, combining enterprise rigor with modern software engineering."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCards.map((card) => {
              const Icon = ICON_MAP[card.icon] || Shield;
              return (
                <Card
                  key={card.id}
                  hoverable
                  className="flex flex-col justify-between h-full bg-white group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-editorial bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#202520] mb-2 group-hover:text-[#43866A] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#777F79] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      {/* 4. FEATURED PROJECTS */}
      {content.show_projects && featuredProjects.length > 0 && (
        <Section size="lg" background="secondary" className="border-b border-[#E8ECE9]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <SectionHeading
              label="Selected Work"
              title="Featured Project Studies"
              subtitle="End-to-end case studies detailing problems, architecture, contributions, and takeaways."
              className="mb-0"
            />
            <Link to="/projects">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View all projects ({projects.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <Card
                key={p.id}
                hoverable
                padding="none"
                className="flex flex-col overflow-hidden group bg-white"
              >
                {/* Cover Image */}
                <Link to={`/projects/${p.slug}`} className="block aspect-[16/10] overflow-hidden bg-black/5">
                  <img
                    src={p.cover_image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="green" size="sm">
                        {p.category}
                      </Badge>
                    </div>
                    <Link to={`/projects/${p.slug}`}>
                      <h3 className="font-serif text-lg font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-[#777F79] mt-2 line-clamp-3 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8ECE9] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech_stack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] text-[#585F5A] bg-[#F7F8F7] px-2 py-0.5 rounded border border-[#E8ECE9]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${p.slug}`}
                      className="text-xs font-medium text-[#43866A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Read Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* 5. RECENT UPDATES (DIARY POSTS) */}
      {content.show_recent && recentPosts.length > 0 && (
        <Section size="lg" background="white" className="border-b border-[#E8ECE9]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <SectionHeading
              label="Reflections"
              title="Recent Diary Notes"
              subtitle="Candid reflections on software engineering, college milestones, and enterprise security."
              className="mb-0"
            />
            <Link to="/diary">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Read full diary ({posts.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Card
                key={post.id}
                hoverable
                className="flex flex-col justify-between bg-white group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#777F79] mb-3">
                    <span className="font-semibold text-[#43866A] uppercase tracking-wider text-[11px]">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <Link to={`/diary/${post.slug}`}>
                    <h3 className="font-serif text-lg font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#777F79] mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8ECE9] flex items-center justify-between text-xs">
                  <span className="text-[#9CA39E]">{post.reading_time} min read</span>
                  <Link
                    to={`/diary/${post.slug}`}
                    className="font-medium text-[#43866A] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read entry</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* 6. CERTIFICATES STRIP */}
      {content.show_certificates && recentCerts.length > 0 && (
        <Section size="md" background="secondary" className="border-b border-[#E8ECE9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                Validation
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#202520] mt-0.5">
                Certifications & Coursework
              </h2>
            </div>
            <Link to="/certificates">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View all certificates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-[#E8ECE9] rounded-editorial p-4 flex items-start gap-3 shadow-subtle"
              >
                <div className="w-9 h-9 rounded-editorial bg-[#EBF3EF] text-[#43866A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#43866A] uppercase">
                      {cert.category}
                    </span>
                    {cert.in_progress && (
                      <Badge variant="in-progress" size="sm">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#202520] truncate mt-0.5">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-[#777F79]">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 7. CLOSING REFLECTIVE SECTION */}
      <Section size="lg" background="white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>

          <blockquote className="font-serif text-xl sm:text-2xl text-[#202520] italic leading-relaxed">
            {content.closing_quote}
          </blockquote>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {settings.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#202520] bg-[#F7F8F7] border border-[#E8ECE9] px-4 py-2 rounded-editorial hover:bg-[#EFF2F0] hover:border-[#43866A] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#43866A]" />
                <span>Connect on LinkedIn</span>
              </a>
            )}
            {settings.github_url && (
              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#202520] bg-[#F7F8F7] border border-[#E8ECE9] px-4 py-2 rounded-editorial hover:bg-[#EFF2F0] hover:border-[#43866A] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-medium text-white bg-[#202520] px-4 py-2 rounded-editorial hover:bg-black transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </Section>
    </PageTransition>
  );
};
