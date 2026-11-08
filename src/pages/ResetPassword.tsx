import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { PageTransition } from '@/components/layout/PageTransition';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const { updatePassword } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await updatePassword(password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(true);
      success('Password updated successfully. You can now sign in.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setErrorMsg(res.error || 'Failed to update password.');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-16 bg-[#F7F8F7]">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#777F79] hover:text-[#202520] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>

          <div className="bg-white border border-[#E8ECE9] rounded-editorial shadow-card p-8 sm:p-10">
            <div className="text-center mb-6">
              <h1 className="font-serif text-2xl font-bold text-[#202520]">
                Set New Password
              </h1>
              <p className="text-sm text-[#777F79] mt-1.5">
                Create a strong password for your administrator account.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-editorial flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg ? (
              <div className="p-4 bg-[#EBF3EF] border border-[#D1DFD8] rounded-editorial text-center text-sm text-[#2E6B52]">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-[#43866A]" />
                <p className="font-semibold">Password updated successfully!</p>
                <p className="text-xs mt-1 text-[#585F5A]">Redirecting to sign-in page...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={loading}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

