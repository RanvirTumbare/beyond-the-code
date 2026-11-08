import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  Download,
  Maximize2,
  X,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { useCertificates } from '@/hooks/useCertificates';
import { Certificate } from '@/lib/types';
import { Helmet } from 'react-helmet-async';

export const Certificates: React.FC = () => {
  const { certificates } = useCertificates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const categories = useMemo(() => {
    const set = new Set(certificates.map((c) => c.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [certificates]);

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

  const completedCerts = useMemo(() => filtered.filter((c) => !c.in_progress), [filtered]);
  const inProgressCerts = useMemo(() => filtered.filter((c) => c.in_progress), [filtered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>Certifications — Ranvir</title>
        <meta
          name="description"
          content="Verified certifications and ongoing coursework in cybersecurity, enterprise SAP, and cloud engineering achieved by Ranvir."
        />
      </Helmet>

      {/* Header & Controls */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Credentials
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#202520]">
            Certifications
          </h1>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
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

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8F7] text-xs pl-8 pr-3 py-1.5 border border-[#E8ECE9] rounded-editorial focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#43866A] placeholder-[#9CA39E]"
            />
          </div>
        </div>
      </Section>

      {/* 1. COMPLETED CERTIFICATIONS */}
      <Section size="lg" background="secondary" className="border-b border-[#E8ECE9]">
        {completedCerts.length === 0 ? (
          <EmptyState
            title="No certifications found"
            message="No credentials matched the current filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCerts.map((cert) => (
              <Card
                key={cert.id}
                hoverable
                padding="none"
                onClick={() => setActiveCert(cert)}
                className="group cursor-pointer bg-white border-[#E8ECE9] overflow-hidden flex flex-col justify-between"
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
                    <div className="w-10 h-10 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#202520]/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
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
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="pt-2.5 border-t border-[#E8ECE9] flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-[#585F5A] bg-[#F7F8F7] px-1.5 py-0.5 rounded border border-[#E8ECE9]"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="text-[10px] text-[#9CA39E]">
                          +{cert.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* 2. COURSES IN PROGRESS */}
      {inProgressCerts.length > 0 && (
        <Section size="md" background="white">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Active Tracks
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#202520]">
              In Progress
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCerts.map((cert) => (
              <Card
                key={cert.id}
                padding="md"
                className="bg-white border-[#E8ECE9] flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="in-progress" size="sm">
                      In Progress
                    </Badge>
                    <span className="text-xs text-[#777F79]">{cert.category}</span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-[#202520]">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-[#777F79]">{cert.issuer}</p>
                </div>

                {cert.skills && cert.skills.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#E8ECE9] flex flex-wrap gap-1">
                    {cert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-[#585F5A] bg-[#F7F8F7] px-1.5 py-0.5 rounded border border-[#E8ECE9]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Lightbox / Modal Viewer */}
      {activeCert && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="bg-white border border-[#E8ECE9] rounded-editorial max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-modal animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-[#E8ECE9] flex items-center justify-between bg-[#F7F8F7]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#202520]">
                  {activeCert.title}
                </h3>
                <p className="text-xs text-[#777F79]">{activeCert.issuer}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                aria-label="Close"
                className="p-1 rounded text-[#777F79] hover:text-[#202520] hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="p-4 flex-1 overflow-auto bg-[#F7F8F7]/50 flex items-center justify-center min-h-[300px]">
              {activeCert.file_url ? (
                activeCert.file_type === 'pdf' ? (
                  <iframe
                    src={activeCert.file_url}
                    title={activeCert.title}
                    className="w-full h-[500px] border border-[#E8ECE9] rounded"
                  />
                ) : (
                  <img
                    src={activeCert.file_url}
                    alt={activeCert.title}
                    className="max-h-[60vh] max-w-full object-contain rounded border border-[#E8ECE9]"
                  />
                )
              ) : (
                <div className="text-center py-12 text-[#777F79]">
                  <Award className="w-10 h-10 mx-auto text-[#43866A] mb-2" />
                  <p className="text-xs">Document scan not uploaded yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#E8ECE9] bg-white flex items-center justify-between">
              {activeCert.completion_date ? (
                <span className="text-xs text-[#777F79] font-mono">
                  Issued:{' '}
                  {new Date(activeCert.completion_date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                {activeCert.file_url && (
                  <a
                    href={activeCert.file_url}
                    download
                    className="text-xs text-[#585F5A] hover:text-[#202520] inline-flex items-center gap-1 border border-[#E8ECE9] px-2.5 py-1.5 rounded"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
                {activeCert.verification_url && (
                  <a
                    href={activeCert.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-white bg-[#43866A] hover:bg-[#366E57] inline-flex items-center gap-1 px-3 py-1.5 rounded transition-colors"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};
