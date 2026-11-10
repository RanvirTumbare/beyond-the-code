import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Download,
  Mail,
  Shield,
  Layers,
  BarChart3,
  Code2,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';
import { useAboutContent } from '@/hooks/useAboutContent';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Helmet } from 'react-helmet-async';

export const About: React.FC = () => {
  const { about, skills } = useAboutContent();
  const { settings } = useSiteSettings();

  const categories = useMemo(() => {
    const defaultCats = [
      'Cybersecurity',
      'SAP / ERP',
      'Data Analytics',
      'Web Development',
      'Programming & Tools',
    ];
    const skillCats = skills.map((s) => s.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...skillCats]));
  }, [skills]);

  const categoryIcons: Record<string, React.ElementType> = {
    Cybersecurity: Shield,
    'SAP / ERP': Layers,
    'Data Analytics': BarChart3,
    'Web Development': Code2,
    'Programming & Tools': Wrench,
  };

  return (
    <PageTransition>
      <Helmet>
        <title>About — Ranvir</title>
        <meta
          name="description"
          content="Learn about Ranvir, a Computer Engineering student specializing in Cybersecurity, Enterprise SAP systems, Data Analytics, and Web Development."
        />
      </Helmet>

      {/* 1. PROFILE & BIO */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Portrait Photo */}
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-subtle bg-[#F7F8F7] max-w-sm mx-auto lg:max-w-none">
              <img
                src={
                  about.photo_url ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
                }
                alt="Ranvir"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bio & Actions */}
          <div className="lg:col-span-8 space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A] inline-block mb-1.5">
                About Me
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202520] tracking-tight">
                Ranvir
              </h1>
              <p className="text-xs text-[#777F79] font-medium mt-1">
                Computer Engineering Student · Mumbai, India
              </p>
            </div>

            <div className="text-sm sm:text-base text-[#585F5A] leading-relaxed space-y-3">
              <p>{about.intro}</p>
              {about.interests && <p>{about.interests}</p>}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {settings.resume_url && (
                <a
                  href={settings.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Resume (PDF)
                  </Button>
                </a>
              )}
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Mail className="w-3.5 h-3.5" />}
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. EDUCATION */}
      {about.education && about.education.length > 0 && (
        <Section size="md" background="secondary" className="border-b border-[#E8ECE9]">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
              Academics
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#202520]">
              Education
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl">
            {about.education.map((item, idx) => (
              <Card key={idx} className="bg-white border-[#E8ECE9] p-5 shadow-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-[#202520]">
                        {item.degree}
                      </h3>
                      <p className="text-xs font-medium text-[#43866A]">
                        {item.institution}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm" className="self-start sm:self-auto font-mono text-[11px]">
                    {item.period}
                  </Badge>
                </div>

                {item.details && (
                  <p className="text-xs text-[#777F79] mt-2 leading-relaxed">
                    {item.details}
                  </p>
                )}

                {item.score && (
                  <div className="mt-3 pt-2.5 border-t border-[#E8ECE9] text-xs font-medium text-[#585F5A]">
                    {item.score}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* 3. TECHNICAL SKILLS */}
      <Section size="md" background="white">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Competencies
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#202520]">
            Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;
            const Icon = categoryIcons[category] || Sparkles;

            return (
              <Card
                key={category}
                className="bg-white border-[#E8ECE9] p-5 shadow-subtle"
              >
                <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-[#E8ECE9]">
                  <Icon className="w-4 h-4 text-[#43866A]" />
                  <h3 className="font-serif text-sm font-semibold text-[#202520]">
                    {category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 bg-[#F7F8F7] border border-[#E8ECE9] px-2.5 py-1 rounded text-xs"
                    >
                      <span className="font-medium text-[#202520]">{skill.name}</span>
                      {skill.level && (
                        <span className="text-[10px] text-[#43866A] font-semibold">
                          · {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </PageTransition>
  );
};
