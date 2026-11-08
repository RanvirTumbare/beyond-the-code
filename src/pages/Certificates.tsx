import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Compass,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { useCertificates } from '@/hooks/useCertificates';
import { Certificate } from '@/lib/types';
import { Helmet } from 'react-helmet-async';

export const Certificates: React.FC = () => {
  const { certificates, loading } = useCertificates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(certificates.map((c) => c.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [certificates]);

  // Filtered dataset
  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const matchCat =
        selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [certificates, selectedCategory, searchQuery]);

  // Separate completed vs in-progress
  const completedCerts = useMemo(() => filtered.filter((c) => !c.in_progress), [filtered]);
  const inProgressCerts = useMemo(() => filtered.filter((c) => c.in_progress), [filtered]);

  // Keyboard navigation for modal (Esc, left arrow, right arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeCert) return;
      if (e.key === 'Escape') {
        setActiveCert(null);
      } else if (e.key === 'ArrowRight') {
        const idx = filtered.findIndex((c) => c.id === activeCert.id);
        if (idx !== -1 && idx < filtered.length - 1) {
          setActiveCert(filtered[idx + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = filtered.findIndex((c) => c.id === activeCert.id);
        if (idx > 0) {
          setActiveCert(filtered[idx - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert, filtered]);

  return (
    <PageTransition>
      <Helmet>
        <title>Certificates & Validated Coursework — Ranvir</title>
        <meta
          name="description"
          content="Verified certifications and ongoing coursework in cybersecurity, enterprise SAP, and cloud engineering achieved by Ranvir."
        />
      </Helmet>

      {/* Header & Controls */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="Verification & Credentialing"
          title="Certifications & Coursework"
          subtitle="Documented credentials from industry programs and academic partnerships. No vanity stats or unearned claims."
        />

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
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
              placeholder="Search by skill or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8F7] text-xs pl-8 pr-3 py-2 border border-[#E8ECE9] rounded-editorial focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#43866A] placeholder-[#9CA39E]"
            />
          </div>
        </div>
      </Section>

      {/* 1. COMPLETED CERTIFICATIONS */}
      <Section size="lg" background="secondary" className="border-b border-[#E8ECE9]">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Verified Credentials
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#202520]">
            Completed Certifications ({completedCerts.length})
          </h2>
        </div>

        {completedCerts.length === 0 ? (
          <EmptyState
            title="No completed certificates found"
            message="No credentials matched the current filter or search criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCerts.map((cert) => (
              <Card
                key={cert.id}
                hoverable
                padding="none"
                onClick={() => setActiveCert(cert)}
                className="group cursor-pointer bg-white overflow-hidden flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] bg-[#F7F8F7] border-b border-[#E8ECE9] overflow-hidden flex items-center justify-center relative">
                  {cert.file_url ? (
                    <img
                      src={cert.file_url}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <span className="bg-[#202520]/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" /> View Credential
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Badge variant="green" size="sm">
                        {cert.category}
                      </Badge>
                      {cert.completion_date && (
                        <span className="text-[11px] text-[#777F79] font-mono">
                          {new Date(cert.completion_date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-base font-semibold text-[#202520] group-hover:text-[#43866A] transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-[#777F79] mt-0.5">{cert.issuer}</p>
                  </div>

                  {/* Skills tags */}
                  <div className="pt-3 border-t border-[#E8ECE9] flex flex-wrap gap-1">
                    {cert.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-[#585F5A] bg-[#F7F8F7] px-2 py-0.5 rounded border border-[#E8ECE9]"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="text-[10px] text-[#9CA39E]">
                        +{cert.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* 2. COURSES IN PROGRESS */}
      {inProgressCerts.length > 0 && (
        <Section size="lg" background="white">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Active Learning
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#202520]">
              Courses In Progress ({inProgressCerts.length})
            </h2>
            <p className="text-xs text-[#777F79] mt-1">
              Active coursework and preparation tracks. No fake completion dates or percentages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCerts.map((cert) => (
              <Card
                key={cert.id}
                padding="md"
                className="bg-white border-[#E8ECE9] shadow-subtle flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="in-progress" size="sm">
                      In progress
                    </Badge>
                    <span className="text-xs text-[#777F79]">{cert.category}</span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#202520] leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-[#777F79] mt-0.5">{cert.issuer}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8ECE9]">
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-[#585F5A] bg-[#F7F8F7] px-2 py-0.5 rounded border border-[#E8ECE9]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Large Credential Viewer Modal */}
      {activeCert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-editorial shadow-modal overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="p-4 px-6 border-b border-[#E8ECE9] flex items-center justify-between bg-[#F7F8F7]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#43866A]">
                  Verified Credential Viewer
                </span>
                <h3 className="font-serif text-lg font-bold text-[#202520] truncate max-w-lg">
                  {activeCert.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveCert(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-full hover:bg-[#EFF2F0] text-[#777F79] hover:text-[#202520]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Columns on desktop */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
              {/* Media viewer left */}
              <div className="md:col-span-7 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial overflow-hidden flex items-center justify-center min-h-[300px]">
                {activeCert.file_url ? (
                  activeCert.file_type === 'pdf' ? (
                    <iframe
                      src={activeCert.file_url}
                      title="PDF Certificate"
                      className="w-full h-full min-h-[400px] border-0"
                    />
                  ) : (
                    <img
                      src={activeCert.file_url}
                      alt={activeCert.title}
                      className="max-h-[500px] w-full object-contain"
                    />
                  )
                ) : (
                  <div className="text-center p-8 text-[#777F79]">
                    <Award className="w-12 h-12 text-[#43866A] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#202520]">Verified Certificate</p>
                    <p className="text-xs text-[#777F79] mt-0.5">
                      Issued by {activeCert.issuer}
                    </p>
                  </div>
                )}
              </div>

              {/* Details panel right */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-[#585F5A] uppercase tracking-wider">
                      Issuer & Authority
                    </span>
                    <p className="font-serif text-lg font-bold text-[#202520] mt-0.5">
                      {activeCert.issuer}
                    </p>
                  </div>

                  {activeCert.completion_date && (
                    <div>
                      <span className="text-xs font-semibold text-[#585F5A] uppercase tracking-wider">
                        Completion Date
                      </span>
                      <p className="text-sm text-[#202520] mt-0.5 font-mono">
                        {new Date(activeCert.completion_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-semibold text-[#585F5A] uppercase tracking-wider">
                      Validated Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {activeCert.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-[#202520] bg-[#F7F8F7] border border-[#E8ECE9] px-2.5 py-1 rounded-editorial"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="pt-4 border-t border-[#E8ECE9] space-y-2">
                  {activeCert.verification_url && (
                    <a
                      href={activeCert.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        Verify Credential Online
                      </Button>
                    </a>
                  )}
                  {activeCert.file_url && (
                    <a
                      href={activeCert.file_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        Download Document
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Keyboard Nav Bar */}
            <div className="p-3 px-6 bg-[#F7F8F7] border-t border-[#E8ECE9] flex items-center justify-between text-xs text-[#777F79]">
              <span className="hidden sm:inline">Use ← / → arrow keys or Esc to navigate</span>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const idx = filtered.findIndex((c) => c.id === activeCert.id);
                    if (idx > 0) setActiveCert(filtered[idx - 1]);
                  }}
                  disabled={filtered.findIndex((c) => c.id === activeCert.id) <= 0}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const idx = filtered.findIndex((c) => c.id === activeCert.id);
                    if (idx !== -1 && idx < filtered.length - 1) {
                      setActiveCert(filtered[idx + 1]);
                    }
                  }}
                  disabled={
                    filtered.findIndex((c) => c.id === activeCert.id) >= filtered.length - 1
                  }
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

