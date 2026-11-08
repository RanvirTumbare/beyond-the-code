import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Github,
  Search,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { useProjects } from '@/hooks/useProjects';
import { Helmet } from 'react-helmet-async';

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

  return (
    <PageTransition>
      <Helmet>
        <title>Engineering Projects & Case Studies — Ranvir</title>
        <meta
          name="description"
          content="Explore comprehensive case studies in cybersecurity audits, full-stack applications, and enterprise data architectures built by Ranvir."
        />
      </Helmet>

      {/* Header & Controls */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="Portfolio of Work"
          title="Engineering Case Studies"
          subtitle="Detailed technical studies breaking down problems, architectural trade-offs, security mechanisms, and key outcomes."
        />

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#202520] text-white shadow-xs'
                    : 'bg-[#F7F8F7] text-[#585F5A] border border-[#E8ECE9] hover:bg-[#EFF2F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8F7] text-xs pl-8 pr-3 py-2 border border-[#E8ECE9] rounded-editorial focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#43866A] placeholder-[#9CA39E]"
            />
          </div>
        </div>
      </Section>

      {/* Projects Grid */}
      <Section size="lg" background="secondary">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No matching case studies"
            message="No projects matched your search or category filter. Try clearing your filter."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                hoverable
                padding="none"
                className="flex flex-col overflow-hidden group bg-white"
              >
                {/* Cover Image */}
                <Link
                  to={`/projects/${project.slug}`}
                  className="block aspect-[16/10] overflow-hidden bg-black/5 relative"
                >
                  <img
                    src={
                      project.cover_image_url ||
                      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#43866A] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D1DFD8] shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </div>
                  )}
                </Link>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Badge variant="green" size="sm" className="mb-2">
                      {project.category}
                    </Badge>

                    <Link to={`/projects/${project.slug}`}>
                      <h3 className="font-serif text-lg font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
                        {project.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#777F79] mt-2 line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech stack & study link */}
                  <div className="pt-3 border-t border-[#E8ECE9] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-[#585F5A] bg-[#F7F8F7] px-2 py-0.5 rounded border border-[#E8ECE9]"
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
            ))}
          </div>
        )}
      </Section>
    </PageTransition>
  );
};

