import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Compass,
  Heart,
  Target,
  Camera,
  Download,
  ArrowRight,
  Shield,
  Layers,
  BarChart3,
  Code2,
  Wrench,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';
import { useAboutContent } from '@/hooks/useAboutContent';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Helmet } from 'react-helmet-async';

export const About: React.FC = () => {
  const { about, skills, loading } = useAboutContent();
  const { settings } = useSiteSettings();

  // Group skills by category
  const categories = [
    'Cybersecurity',
    'SAP / ERP',
    'Data Analytics',
    'Web Development',
    'Programming & Tools',
  ] as const;

  const categoryIcons: Record<string, React.ElementType> = {
    'Cybersecurity': Shield,
    'SAP / ERP': Layers,
    'Data Analytics': BarChart3,
    'Web Development': Code2,
    'Programming & Tools': Wrench,
  };

  return (
    <PageTransition>
      <Helmet>
        <title>About Ranvir — Philosophy, Education & Engineering Focus</title>
        <meta
          name="description"
          content="Learn about Ranvir, a Computer Engineering student specializing in Cybersecurity, Enterprise SAP systems, Data Analytics, and Web Engineering."
        />
      </Helmet>

      {/* 1. HERO & INTRODUCTION */}
      <Section size="lg" background="white" className="border-b border-[#E8ECE9]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Portrait & Quick Bio Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[4/5] rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-card bg-[#F7F8F7]">
              <img
                src={
                  about.photo_url ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
                }
                alt="Ranvir — About Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Resume button & connect */}
            <div className="p-4 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial space-y-3">
              <p className="text-xs text-[#777F79]">
                Interested in working together or exploring collaboration?
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                {settings.resume_url ? (
                  <a
                    href={settings.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      Download Resume (PDF)
                    </Button>
                  </a>
                ) : (
                  <Link to="/contact" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      Contact Directly
                    </Button>
                  </Link>
                )}
                <Link to="/contact">
                  <Button variant="outline" size="sm">
                    Inquire
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A] inline-block mb-2">
                Biography & Mindset
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202520] tracking-tight leading-snug">
                Building systems where reliability and human purpose align.
              </h1>
            </div>

            <div className="prose prose-sm sm:prose-base text-[#585F5A] leading-relaxed space-y-4">
              <p className="text-base sm:text-lg text-[#202520] font-normal leading-relaxed">
                {about.intro}
              </p>
            </div>

            {/* 3 Pillars: Approach, Personality, Aspirations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Card className="bg-[#F7F8F7]/50 border-[#E8ECE9] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  <Compass className="w-4 h-4" />
                  <span>Engineering Approach</span>
                </div>
                <p className="text-xs text-[#585F5A] leading-relaxed">
                  {about.approach}
                </p>
              </Card>

              <Card className="bg-[#F7F8F7]/50 border-[#E8ECE9] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  <Target className="w-4 h-4" />
                  <span>Future Aspirations</span>
                </div>
                <p className="text-xs text-[#585F5A] leading-relaxed">
                  {about.aspirations}
                </p>
              </Card>

              <Card className="bg-[#F7F8F7]/50 border-[#E8ECE9] p-5 space-y-2 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43866A]">
                  <Heart className="w-4 h-4" />
                  <span>Personality & Values</span>
                </div>
                <p className="text-xs text-[#585F5A] leading-relaxed">
                  {about.personality}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. EDUCATION SECTION */}
      <Section size="lg" background="secondary" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="Academic Foundation"
          title="Education & Formal Coursework"
          subtitle="A structured foundation in Computer Engineering, mathematics, and software design."
        />

        <div className="space-y-4 max-w-3xl">
          {about.education?.map((item, idx) => (
            <Card key={idx} className="bg-white border-[#E8ECE9] p-6 shadow-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#202520]">
                      {item.degree}
                    </h3>
                    <p className="text-xs font-medium text-[#43866A]">
                      {item.institution}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" size="sm" className="self-start sm:self-auto">
                  {item.period}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-[#777F79] mt-3 leading-relaxed">
                {item.details}
              </p>

              {item.score && (
                <div className="mt-3 pt-3 border-t border-[#E8ECE9] flex items-center justify-between text-xs">
                  <span className="font-medium text-[#585F5A]">{item.score}</span>
                  <span className="text-[11px] text-[#9CA39E]">Verified Institutional Record</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. SKILLS SECTION (GROUPED TAGS, NO PERCENTAGE BARS) */}
      <Section size="lg" background="white" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="Technical Toolkit"
          title="Skills & Competencies"
          subtitle="Categorized technical competencies with honest proficiency labels. No vanity percentages."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;
            const Icon = categoryIcons[category] || Sparkles;

            return (
              <Card
                key={category}
                className="bg-white border-[#E8ECE9] p-6 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#E8ECE9]">
                    <div className="w-8 h-8 rounded-editorial bg-[#EBF3EF] text-[#43866A] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#202520]">
                      {category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="inline-flex items-center gap-2 bg-[#F7F8F7] border border-[#E8ECE9] px-3 py-1.5 rounded-editorial text-xs transition-colors hover:border-[#43866A] hover:bg-[#F4F8F5]"
                      >
                        <span className="font-medium text-[#202520]">{skill.name}</span>
                        <span className="text-[10px] uppercase font-semibold text-[#43866A] bg-[#EBF3EF] px-1.5 py-0.5 rounded">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* 4. BEYOND TECHNOLOGY */}
      <Section size="lg" background="secondary">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center border border-[#D1DFD8] shadow-subtle">
              <Camera className="w-10 h-10" />
            </div>
          </div>
          <div className="md:col-span-8 space-y-3 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
              Human Perspective
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#202520]">
              Beyond Technology
            </h2>
            <p className="text-sm text-[#777F79] leading-relaxed">
              {about.beyond_technology}
            </p>
            <div className="pt-2">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#43866A] hover:underline"
              >
                <span>Browse my visual journal & campus moments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </PageTransition>
  );
};
