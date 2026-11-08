import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Send,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageTransition } from '@/components/layout/PageTransition';
import { useDiary, useDiaryDetail } from '@/hooks/useDiary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/contexts/ToastContext';

export const DiaryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useDiaryDetail(slug || '');
  const { posts } = useDiary();
  const { success } = useToast();

  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight) {
        const progress = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    success('Story link copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-reading mx-auto px-4 py-16 space-y-4">
        <Skeleton variant="text" width="100px" />
        <Skeleton variant="title" width="80%" />
        <Skeleton variant="rect" height="360px" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" />
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="font-serif text-2xl font-bold text-[#202520] mb-2">
          Diary Entry Not Found
        </h2>
        <p className="text-sm text-[#777F79] mb-6">
          This reflection is missing, relocated, or still in draft status.
        </p>
        <Link to="/diary">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Diary
          </Button>
        </Link>
      </div>
    );
  }

  // Prev & Next navigation
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex !== -1 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // Related stories (exclude current)
  const relatedPosts = posts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <PageTransition>
      <Helmet>
        <title>{post.seo_title || `${post.title} — Digital Diary by Ranvir`}</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
      </Helmet>

      {/* Reading Progress Bar (Fixed Top) */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-[#E8ECE9]">
        <div
          className="h-full bg-[#43866A] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="w-full bg-white pb-20">
        {/* Article Header */}
        <header className="max-w-reading mx-auto px-4 sm:px-6 pt-12 pb-8 space-y-4">
          <Link
            to="/diary"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#43866A] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Digital Diary</span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant="green" size="sm">
              {post.category}
            </Badge>
            {post.is_future_note && (
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Send className="w-3 h-3" /> Note to Future Self
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#202520] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pt-2 border-t border-[#E8ECE9] text-xs text-[#777F79]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#43866A]" />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#43866A]" />
                {post.reading_time} min read
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-xs text-[#585F5A] hover:text-[#202520] p-1 rounded"
              title="Copy Story Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#43866A]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="max-w-editorial mx-auto px-4 sm:px-6 mb-10">
            <div className="aspect-[21/9] rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-subtle bg-black/5">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* Reading Column (Editorial Markdown Content ~700px) */}
        <div className="max-w-reading mx-auto px-4 sm:px-6">
          {/* Excerpt Lead */}
          <div className="text-base sm:text-lg text-[#585F5A] font-serif italic mb-8 pb-6 border-b border-[#E8ECE9] leading-relaxed">
            {post.excerpt}
          </div>

          {/* Rendered Markdown Body */}
          <div className="prose prose-base text-[#202520] prose-headings:font-serif prose-headings:text-[#202520] prose-headings:tracking-tight prose-a:text-[#43866A] prose-a:underline prose-code:text-[#43866A] prose-code:bg-[#EBF3EF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#141814] prose-pre:text-white prose-blockquote:border-l-[#43866A] prose-blockquote:text-[#585F5A] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Story Sign-off */}
          <div className="mt-12 pt-8 border-t border-[#E8ECE9] flex items-center justify-between">
            <div>
              <p className="font-serif font-semibold text-sm text-[#202520]">
                Ranvir
              </p>
              <p className="text-xs text-[#777F79]">
                Computer Engineering Student & Technical Explorer
              </p>
            </div>
            <Link to="/contact">
              <Button variant="outline" size="sm">
                Discuss This Entry
              </Button>
            </Link>
          </div>

          {/* Previous / Next Entry Navigation */}
          <div className="mt-8 pt-8 border-t border-[#E8ECE9] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/diary/${prevPost.slug}`}
                className="p-4 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] bg-[#F7F8F7] transition-colors group text-left"
              >
                <span className="text-[10px] text-[#777F79] uppercase tracking-wider flex items-center gap-1 mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous Reflection
                </span>
                <p className="font-serif font-semibold text-sm text-[#202520] group-hover:text-[#43866A] transition-colors truncate">
                  {prevPost.title}
                </p>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link
                to={`/diary/${nextPost.slug}`}
                className="p-4 rounded-editorial border border-[#E8ECE9] hover:border-[#43866A] bg-[#F7F8F7] transition-colors group text-right ml-auto w-full"
              >
                <span className="text-[10px] text-[#777F79] uppercase tracking-wider flex items-center justify-end gap-1 mb-1">
                  Next Reflection <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <p className="font-serif font-semibold text-sm text-[#202520] group-hover:text-[#43866A] transition-colors truncate">
                  {nextPost.title}
                </p>
              </Link>
            ) : <div />}
          </div>

          {/* Related Stories */}
          {relatedPosts.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[#E8ECE9] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#202520]">
                Related Reflections
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((r) => (
                  <Link
                    key={r.id}
                    to={`/diary/${r.slug}`}
                    className="p-4 bg-white border border-[#E8ECE9] rounded-editorial hover:border-[#43866A] transition-colors group"
                  >
                    <span className="text-[10px] uppercase font-semibold text-[#43866A]">
                      {r.category}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors mt-1">
                      {r.title}
                    </h4>
                    <p className="text-xs text-[#777F79] line-clamp-2 mt-1">
                      {r.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </PageTransition>
  );
};

