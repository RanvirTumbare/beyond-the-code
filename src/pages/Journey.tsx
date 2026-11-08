import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Filter,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  Tag,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageTransition } from '@/components/layout/PageTransition';
import { useJourney } from '@/hooks/useJourney';
import { useProjects } from '@/hooks/useProjects';
import { JourneyEvent, JourneyEventType } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet-async';

const EVENT_TYPES: Array<JourneyEventType | 'All'> = [
  'All',
  'Education',
  'Hackathon',
  'Achievement',
  'Workshop',
  'Event',
  'Milestone',
];

export const Journey: React.FC = () => {
  const { events, loading } = useJourney();
  const { projects } = useProjects();

  const [selectedType, setSelectedType] = useState<JourneyEventType | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedEvent, setSelectedEvent] = useState<JourneyEvent | null>(null);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let list = [...events];
    if (selectedType !== 'All') {
      list = list.filter((e) => e.type === selectedType);
    }
    list.sort((a, b) => {
      const dateA = new Date(a.event_date).getTime();
      const dateB = new Date(b.event_date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return list;
  }, [events, selectedType, sortOrder]);

  // Group by year
  const groupedByYear = useMemo(() => {
    const groups: Record<string, JourneyEvent[]> = {};
    for (const event of filteredEvents) {
      const year = new Date(event.event_date).getFullYear().toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    }
    return groups;
  }, [filteredEvents]);

  const years = Object.keys(groupedByYear).sort((a, b) =>
    sortOrder === 'newest' ? Number(b) - Number(a) : Number(a) - Number(b)
  );

  return (
    <PageTransition>
      <Helmet>
        <title>Journey Timeline — Ranvir | Milestones & Technical Growth</title>
        <meta
          name="description"
          content="Explore the engineering journey of Ranvir: university milestones, hackathon sprints, enterprise security discoveries, and achievements."
        />
      </Helmet>

      {/* Header */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="The Chronicle"
          title="Timeline & Milestones"
          subtitle="A candid, living chronicle of university milestones, hackathon sprints, workshops, and engineering breakthroughs."
        />

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedType === type
                    ? 'bg-[#202520] text-white shadow-xs'
                    : 'bg-[#F7F8F7] text-[#585F5A] border border-[#E8ECE9] hover:bg-[#EFF2F0]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#202520] bg-white border border-[#E8ECE9] px-3 py-1.5 rounded-editorial hover:bg-[#F7F8F7] transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#43866A]" />
            <span>
              {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            </span>
          </button>
        </div>
      </Section>

      {/* Timeline Section */}
      <Section size="lg" background="secondary">
        <div className="max-w-3xl mx-auto">
          {years.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-[#D5DDD8] rounded-editorial p-8">
              <Compass className="w-8 h-8 text-[#9CA39E] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#202520]">No milestone entries found</p>
              <p className="text-xs text-[#777F79] mt-1">
                Try selecting a different filter category.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {years.map((year) => (
                <div key={year} className="relative">
                  {/* Year Marker */}
                  <div className="sticky top-20 z-10 inline-block mb-6">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#202520] bg-[#EBF3EF] text-[#43866A] px-4 py-1 rounded-editorial border border-[#D1DFD8] shadow-xs">
                      {year}
                    </span>
                  </div>

                  {/* Vertical Line Container */}
                  <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E8ECE9] space-y-8 ml-3 sm:ml-4">
                    {groupedByYear[year].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEvent(item)}
                        className={`group relative bg-white border rounded-editorial p-5 sm:p-6 shadow-subtle cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 ${
                          item.featured
                            ? 'border-[#43866A]/60 ring-1 ring-[#43866A]/20'
                            : 'border-[#E8ECE9]'
                        }`}
                      >
                        {/* Timeline Node Dot */}
                        <div
                          className={`absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors ${
                            item.featured ? 'bg-[#43866A] ring-2 ring-[#43866A]/30' : 'bg-[#D5DDD8] group-hover:bg-[#43866A]'
                          }`}
                        />

                        {/* Event Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={item.featured ? 'green' : 'neutral'} size="sm">
                              {item.type}
                            </Badge>
                            {item.featured && (
                              <span className="text-[10px] uppercase font-semibold text-[#43866A] flex items-center gap-0.5">
                                <Sparkles className="w-3 h-3" /> Featured
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#777F79] flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Title & Summary */}
                        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#777F79] mt-2 leading-relaxed">
                          {item.summary}
                        </p>

                        {/* Cover thumbnail if available */}
                        {item.cover_image_url && (
                          <div className="mt-4 aspect-[21/9] rounded-editorial overflow-hidden bg-black/5">
                            <img
                              src={item.cover_image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Tags & Click CTA */}
                        <div className="mt-4 pt-3 border-t border-[#E8ECE9] flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-[#777F79] bg-[#F7F8F7] px-2 py-0.5 rounded border border-[#E8ECE9]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-[#43866A] group-hover:underline inline-flex items-center gap-1">
                            <span>Read Story</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Final "What's Next" Entry */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-[#43866A]/40 ml-3 sm:ml-4">
                <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-[#43866A] border-2 border-white ring-2 ring-[#43866A]/30 animate-pulse" />
                <div className="bg-[#EBF3EF]/40 border border-[#D1DFD8] rounded-editorial p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43866A] mb-1">
                    <Compass className="w-4 h-4" />
                    <span>The Horizon</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#202520]">
                    What's Next?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#585F5A] mt-2 leading-relaxed">
                    Targeting graduation in 2026, deepening security certifications, publishing open-source compliance tooling, and preparing for enterprise infrastructure engineering roles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Detail Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
        subtitle={`${selectedEvent?.type} • ${
          selectedEvent ? new Date(selectedEvent.event_date).toLocaleDateString() : ''
        }`}
        maxWidth="2xl"
      >
        {selectedEvent && (
          <div className="space-y-6 text-[#202520]">
            {/* Cover Photo */}
            {selectedEvent.cover_image_url && (
              <div className="aspect-video rounded-editorial overflow-hidden bg-black/5">
                <img
                  src={selectedEvent.cover_image_url}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Markdown Narrative */}
            <div className="prose prose-sm max-w-none text-[#202520] prose-headings:font-serif prose-a:text-[#43866A] leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedEvent.content || selectedEvent.summary}
              </ReactMarkdown>
            </div>

            {/* Media Gallery if any */}
            {selectedEvent.media && selectedEvent.media.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E8ECE9]">
                <h4 className="text-xs font-semibold text-[#585F5A] uppercase tracking-wider">
                  Event Media & Photos
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedEvent.media.map((m, idx) => (
                    <div key={idx} className="rounded-editorial overflow-hidden aspect-video bg-black/5">
                      <img src={m.url} alt={m.caption || 'Event media'} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedEvent.tags && selectedEvent.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedEvent.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-[#585F5A] bg-[#F7F8F7] border border-[#E8ECE9] px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-[#43866A]" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Linked Project Button if available */}
            {selectedEvent.project_id && (
              <div className="pt-4 border-t border-[#E8ECE9] flex justify-end">
                <Link
                  to="/projects"
                  onClick={() => setSelectedEvent(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#43866A] bg-[#EBF3EF] px-3.5 py-2 rounded-editorial hover:bg-[#DDF0E6]"
                >
                  <span>Explore Associated Case Study</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageTransition>
  );
};

