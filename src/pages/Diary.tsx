import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Search,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  Send,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { useDiary } from '@/hooks/useDiary';
import { Helmet } from 'react-helmet-async';

const CATEGORIES = [
  'All',
  'Technology',
  'Learning Logs',
  'College Life',
  'Hackathons',
  'Personal Growth',
  'Experiences',
];

export const Diary: React.FC = () => {
  const { posts, loading } = useDiary();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredPosts = useMemo(() => {
    let list = posts.filter((p) => {
      const matchCat =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    list.sort((a, b) => {
      const dateA = new Date(a.published_at).getTime();
      const dateB = new Date(b.published_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [posts, selectedCategory, searchQuery, sortOrder]);

  // Extract future notes
  const futureNotes = useMemo(
    () => filteredPosts.filter((p) => p.is_future_note),
    [filteredPosts]
  );
  const regularPosts = useMemo(
    () => filteredPosts.filter((p) => !p.is_future_note),
    [filteredPosts]
  );

  return (
    <PageTransition>
      <Helmet>
        <title>Digital Diary & Learning Reflections — Ranvir</title>
        <meta
          name="description"
          content="Ranvir's personal digital diary: technical reflections, college life logs, engineering observations, and notes to his future self."
        />
      </Helmet>

      {/* Header */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="The Digital Diary"
          title="Essays & Field Notes"
          subtitle="Reflective long-form essays, university logs, security post-mortems, and letters to my future engineering self."
        />

        {/* Controls */}
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

          {/* Search & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search reflections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F8F7] text-xs pl-8 pr-3 py-2 border border-[#E8ECE9] rounded-editorial focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#43866A] placeholder-[#9CA39E]"
              />
            </div>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#202520] bg-white border border-[#E8ECE9] px-2.5 py-2 rounded-editorial hover:bg-[#F7F8F7]"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#43866A]" />
              <span className="hidden sm:inline">
                {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
              </span>
            </button>
          </div>
        </div>
      </Section>

      {/* 1. HIGHLIGHTED "A NOTE TO MY FUTURE SELF" SECTION */}
      {futureNotes.length > 0 && (
        <Section size="md" background="secondary" className="border-b border-[#E8ECE9]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A] inline-flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Epistle to the Future
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#202520]">
                A Note to My Future Self
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureNotes.map((post) => (
              <Card
                key={post.id}
                hoverable
                className="bg-white border-[#D1DFD8] ring-1 ring-[#43866A]/20 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#777F79] mb-3">
                    <Badge variant="green" size="sm">
                      Future Self Capsule
                    </Badge>
                    <span className="font-mono text-[11px]">
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <Link to={`/diary/${post.slug}`}>
                    <h3 className="font-serif text-xl font-bold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#585F5A] mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8ECE9] flex items-center justify-between text-xs">
                  <span className="text-[#9CA39E] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.reading_time} min read
                  </span>
                  <Link
                    to={`/diary/${post.slug}`}
                    className="font-medium text-[#43866A] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open capsule</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* 2. REGULAR DIARY ENTRIES GRID */}
      <Section size="lg" background="white">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777F79]">
            Entries & Reflections
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#202520]">
            Chronological Entries ({regularPosts.length})
          </h2>
        </div>

        {regularPosts.length === 0 ? (
          <EmptyState
            title="No reflections found"
            message="No diary entries match your current search query or category filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card
                key={post.id}
                hoverable
                padding="none"
                className="bg-white overflow-hidden flex flex-col justify-between group"
              >
                {post.cover_image_url && (
                  <Link
                    to={`/diary/${post.slug}`}
                    className="block aspect-[16/9] overflow-hidden bg-black/5"
                  >
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#777F79] mb-2">
                      <span className="font-semibold text-[#43866A] uppercase tracking-wider text-[11px]">
                        {post.category}
                      </span>
                      <span className="font-mono text-[11px]">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
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

                  <div className="pt-3 border-t border-[#E8ECE9] flex items-center justify-between text-xs">
                    <span className="text-[#9CA39E] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.reading_time} min read
                    </span>
                    <Link
                      to={`/diary/${post.slug}`}
                      className="font-medium text-[#43866A] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read entry</span>
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
