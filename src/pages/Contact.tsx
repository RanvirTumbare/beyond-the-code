import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
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
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Bot honeypot trap
    if (honeypot.trim()) {
      setSubmitted(true);
      return;
    }

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Please fill in all fields.');
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
      setSubmitted(true);
      success('Your message has been sent.');
    } else {
      setErrorMessage(res.error || 'Failed to send message.');
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
        <title>Contact — Ranvir</title>
        <meta
          name="description"
          content="Get in touch with Ranvir for technical inquiries, cybersecurity opportunities, or collaboration."
        />
      </Helmet>

      {/* Header */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#202520]">
            Contact
          </h1>
        </div>
      </Section>

      {/* Main Content */}
      <Section size="lg" background="secondary">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-editorial mx-auto">
          {/* Left Column: Direct Links & Resume */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="bg-white border-[#E8ECE9] p-6 shadow-subtle space-y-5">
              <h2 className="font-serif text-lg font-bold text-[#202520] pb-2 border-b border-[#E8ECE9]">
                Direct Contacts
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                {settings.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#777F79] block">Email</span>
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
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center shrink-0">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#777F79] block">LinkedIn</span>
                      <a
                        href={settings.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#202520] hover:text-[#43866A] transition-colors"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  </div>
                )}

                {settings.github_url && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center shrink-0">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#777F79] block">GitHub</span>
                      <a
                        href={settings.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#202520] hover:text-[#43866A] transition-colors"
                      >
                        GitHub Repositories
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {settings.resume_url && (
                <div className="pt-3 border-t border-[#E8ECE9]">
                  <a
                    href={settings.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
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
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-7">
            <Card className="bg-white border-[#E8ECE9] p-6 shadow-subtle">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#202520]">
                    Message Sent
                  </h3>
                  <p className="text-xs text-[#777F79] max-w-sm mx-auto">
                    Thank you. Your message has been received.
                  </p>
                  <div className="pt-3">
                    <Button variant="outline" size="sm" onClick={resetForm}>
                      Send Another
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field (hidden from humans) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="hp_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                    <Input
                      label="Your Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Project Inquiry / Opportunity"
                    required
                  />

                  <Textarea
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    rows={4}
                    required
                  />

                  <div className="flex justify-end pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={loading}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
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
