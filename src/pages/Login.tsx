import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { PageTransition } from '@/components/layout/PageTransition';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { signIn, resetPassword, isOfflineMode } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Location redirect target
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      success('Welcome back, Ranvir. Dashboard access granted.');
      navigate(fromLocation, { replace: true });
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
      toastError(result.error || 'Failed to sign in');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toastError('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    const res = await resetPassword(resetEmail);
    setResetLoading(false);
    if (res.success) {
      success('Password recovery email dispatched. Please check your inbox.');
      setResetModalOpen(false);
    } else {
      toastError(res.error || 'Failed to dispatch password recovery email.');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-16 bg-[#F7F8F7]">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#777F79] hover:text-[#202520] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to website</span>
          </Link>

          {/* Minimal Editorial Card */}
          <div className="bg-white border border-[#E8ECE9] rounded-editorial shadow-card p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#202520] tracking-tight">
                Welcome back.
              </h1>
              <p className="text-sm text-[#777F79] mt-1.5">
                Sign in to manage your website and content
              </p>
            </div>

            {/* Offline Mode Alert */}
            {isOfflineMode && (
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200/80 rounded-editorial text-xs text-amber-800">
                <p className="font-medium">Local / Mock Development Mode Active</p>
                <p className="mt-0.5 text-amber-700">
                  Supabase keys not yet configured. Enter any email and password (≥6 chars) to preview the complete Admin Dashboard.
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-editorial flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="ranvir@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setResetModalOpen(true);
                    }}
                    className="text-xs text-[#43866A] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={loading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </form>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-[#E8ECE9] text-center">
              <p className="text-xs text-[#777F79] font-medium flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-[#43866A]" />
                Private administrator access only
              </p>
              <p className="text-[11px] text-[#9CA39E] mt-1">
                Public registration is disabled. Security is enforced via Row Level Security.
              </p>
            </div>
          </div>
        </div>

        {/* Password Reset Modal */}
        <Modal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title="Reset Administrator Password"
          subtitle="A secure recovery link will be dispatched to your email address."
        >
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <Input
              label="Account Email"
              type="email"
              placeholder="ranvir@example.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8ECE9]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResetModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={resetLoading}
              >
                Dispatch Reset Link
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
};
