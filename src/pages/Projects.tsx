import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { useProjects } from '@/hooks/useProjects';
import { Helmet } from 'react-helmet-async';
import { Project } from '@/lib/types';

const CATEGORIES = [
  'All',
  'Cybersecurity',
  'Web Development',
  'Data Analytics',
  'SAP / ERP',
  'IoT',
  'Other',
];

export const Projects: React.FC = () => {
  const { projects, loading } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tech_stack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Separate Completed vs Ongoing Projects
  const completedProjects = useMemo(
    () => filteredProjects.filter((p) => !p.in_progress),
    [filteredProjects]
  );
  const ongoingProjects = useMemo(
    () => filteredProjects.filter((p) => p.in_progress),
    [filteredProjects]
  );

  const renderProjectCard = (project: Project, isOngoing: boolean = false) => (
    <Card
      key={project.id}
      hoverable
      padding="none"
      className="flex flex-col overflow-hidden group bg-white border-[#E8ECE9]"
    >
      {/* Cover Image */}
      <Link
        to={`/projects/${project.slug}`}
        className="block aspect-[16/10] overflow-hidden bg-[#F7F8F7] relative"
      >
        <img
          src={
            project.cover_image_url ||
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
          }
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {isOngoing && (
            <span className="bg-amber-50/95 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
              Ongoing
            </span>
          )}
          {project.featured && !isOngoing && (
            <span className="bg-white/95 text-[#43866A] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D1DFD8]">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isOngoing ? 'in-progress' : 'green'} size="sm">
              {project.category}
            </Badge>
          </div>

          <Link to={`/projects/${project.slug}`}>
            <h3 className="font-serif text-base font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
              {project.title}
            </h3>
          </Link>

          <p className="text-xs text-[#777F79] mt-1.5 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Tech stack & study link */}
        <div className="pt-3 border-t border-[#E8ECE9] flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] text-[#585F5A] bg-[#F7F8F7] px-1.5 py-0.5 rounded border border-[#E8ECE9]"
              >
                {tech}
              </span>
            ))}
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="text-xs font-semibold text-[#43866A] hover:underline inline-flex items-center gap-0.5"
          >
            <span>Case Study</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </Card>
  );

  return (
    <PageTransition>
      <Helmet>
        <title>Projects — Ranvir</title>
        <meta
          name="description"
          content="Engineering case studies in cybersecurity, full-stack applications, and enterprise data architectures built by Ranvir."
        />
      </Helmet>

      {/* Header & Controls */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Work
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#202520]">
            Projects
          </h1>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#202520] text-white'
                    : 'bg-[#F7F8F7] text-[#585F5A] border border-[#E8ECE9] hover:bg-[#EFF2F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8F7] text-xs pl-8 pr-3 py-1.5 border border-[#E8ECE9] rounded-editorial focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#43866A] placeholder-[#9CA39E]"
            />
          </div>
        </div>
      </Section>

      {/* 1. COMPLETED PROJECTS */}
      <Section size="lg" background="secondary" className="border-b border-[#E8ECE9]">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Production & Prototypes
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#202520]">
            Completed Projects ({completedProjects.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : completedProjects.length === 0 ? (
          <EmptyState
            title="No completed projects found"
            message="No completed projects matched your filter."
            actionLabel="Reset"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((p) => renderProjectCard(p, false))}
          </div>
        )}
      </Section>

      {/* 2. ONGOING PROJECTS */}
      {ongoingProjects.length > 0 && (
        <Section size="lg" background="white">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Active Exploration
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#202520]">
              Ongoing Projects ({ongoingProjects.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingProjects.map((p) => renderProjectCard(p, true))}
          </div>
        </Section>
      )}
    </PageTransition>
  );
};
