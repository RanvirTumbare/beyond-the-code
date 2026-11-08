import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Globe,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { PageTransition } from '@/components/layout/PageTransition';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useMessages } from '@/hooks/useMessages';
import { useToast } from '@/contexts/ToastContext';
import { Helmet } from 'react-helmet-async';

export const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  const { sendMessage } = useMessages();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Honeypot check (anti-spam bot trap)
    if (honeypot.trim()) {
      console.warn('Bot submission caught via honeypot.');
      setSubmitted(true);
      return;
    }

    // 2. Simple client rate limiting: minimum 30 seconds between submissions
    const lastSentTime = localStorage.getItem('btc_last_message_ts');
    if (lastSentTime) {
      const elapsed = Date.now() - Number(lastSentTime);
      if (elapsed < 30000) {
        setErrorMessage(
          'Please wait a few seconds before sending another message to prevent spam.'
        );
        return;
      }
    }

    // 3. Validation
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const res = await sendMessage({
      name,
      email,
      subject,
      message,
    });
    setLoading(false);

    if (res.success) {
      localStorage.setItem('btc_last_message_ts', String(Date.now()));
      setSubmitted(true);
      success('Your inquiry has been sent to Ranvir.');
    } else {
      setErrorMessage(res.error || 'Failed to deliver message. Please try again.');
      toastError(res.error || 'Failed to send message');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Contact & Inquiries — Ranvir</title>
        <meta
          name="description"
          content="Get in touch with Ranvir for technical inquiries, cybersecurity opportunities, or academic discussions."
        />
      </Helmet>

      {/* Header */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="Direct Correspondence"
          title="Get in Touch"
          subtitle="Whether you have an inquiry regarding a case study, enterprise security research, or full-stack opportunities, my inbox is open."
        />
      </Section>

      <Section size="lg" background="secondary">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-editorial mx-auto">
          {/* Left Column: Direct Contact Info & Resume Download */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white border-[#E8ECE9] p-6 shadow-subtle space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#202520]">
                  Contact Information
                </h3>
                <p className="text-xs text-[#777F79] mt-1 leading-relaxed">
                  I typically respond within 24 to 48 hours to academic and professional correspondence.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {settings.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777F79] block">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${settings.email}`}
                        className="font-medium text-[#202520] hover:text-[#43866A] transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {settings.linkedin_url && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777F79] block">
                        Professional Network
                      </span>
                      <a
                        href={settings.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#202520] hover:text-[#43866A] transition-colors"
                      >
                        Connect on LinkedIn
                      </a>
                    </div>
                  </div>
                )}

                {settings.github_url && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center flex-shrink-0">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777F79] block">
                        Open Source Repositories
                      </span>
                      <a
                        href={settings.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#202520] hover:text-[#43866A] transition-colors"
                      >
                        github.com/ranvir
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Resume Download CTA */}
              <div className="pt-4 border-t border-[#E8ECE9]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777F79] block mb-2">
                  Curriculum Vitae
                </span>
                {settings.resume_url ? (
                  <a
                    href={settings.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
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
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Resume PDF being updated
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <Card className="bg-white border-[#E8ECE9] p-8 shadow-subtle">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#202520]">
                    Message Delivered
                  </h3>
                  <p className="text-sm text-[#777F79] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your note has been delivered to Ranvir's inbox. Expect a reply shortly.
                  </p>
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    Send Another Note
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#202520]">
                      Send a Direct Message
                    </h3>
                    <p className="text-xs text-[#777F79] mt-0.5">
                      Your email address will remain confidential.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-editorial flex items-start gap-2.5 text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Honeypot field for anti-bot spam protection */}
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Leave this empty
                      <input
                        type="text"
                        name="bot_field"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Your Email"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="Regarding SentinelAudit or Collaboration"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />

                  <Textarea
                    label="Your Message"
                    placeholder="Write your note, question, or proposal..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={loading}
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </PageTransition>
  );
};

