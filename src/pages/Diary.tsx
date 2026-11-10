import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { useDiary } from '@/hooks/useDiary';
import { Helmet } from 'react-helmet-async';

export const Diary: React.FC = () => {
  const { posts } = useDiary();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const categories = useMemo(() => {
    const defaultCats = [
      'All',
      'Technology',
      'Learning Logs',
      'College Life',
      'Hackathons',
      'Personal Growth',
      'Experiences',
    ];
    const postCats = posts.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...postCats]));
  }, [posts]);

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

  return (
    <PageTransition>
      <Helmet>
        <title>Articles — Ranvir</title>
        <meta
          name="description"
          content="Technical notes, reflections, and engineering logs written by Ranvir."
        />
      </Helmet>

      {/* Header & Controls */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Writing
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#202520]">
            Articles
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
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

          {/* Search & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-52">
              <Search className="w-3.5 h-3.5 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F8F7] text-xs pl-8 pr-3 py-1.5 border border-[#E8ECE9] rounded-editorial focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#43866A] placeholder-[#9CA39E]"
              />
            </div>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#202520] bg-[#F7F8F7] border border-[#E8ECE9] px-2.5 py-1.5 rounded-editorial hover:bg-[#EFF2F0]"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#43866A]" />
              <span className="hidden sm:inline">
                {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
              </span>
            </button>
          </div>
        </div>
      </Section>

      {/* Unified Articles Grid */}
      <Section size="lg" background="secondary">
        {filteredPosts.length === 0 ? (
          <EmptyState
            title="No articles found"
            message="No articles match your current search query or filter."
            actionLabel="Reset"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                hoverable
                padding="none"
                className="bg-white border-[#E8ECE9] overflow-hidden flex flex-col justify-between group"
              >
                {post.cover_image_url && (
                  <Link
                    to={`/diary/${post.slug}`}
                    className="block aspect-[16/9] overflow-hidden bg-[#F7F8F7]"
                  >
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#777F79] mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#43866A] text-[11px]">
                          {post.category}
                        </span>
                        {post.is_future_note && (
                          <span className="text-[10px] bg-[#EBF3EF] text-[#43866A] px-1.5 py-0.2 rounded font-medium border border-[#D1DFD8]">
                            Future Note
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px]">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <Link to={`/diary/${post.slug}`}>
                      <h3 className="font-serif text-base font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#777F79] mt-1.5 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8ECE9] flex items-center justify-between text-xs">
                    <span className="text-[#9CA39E] flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {post.reading_time} min read
                    </span>
                    <Link
                      to={`/diary/${post.slug}`}
                      className="font-medium text-[#43866A] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read</span>
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
