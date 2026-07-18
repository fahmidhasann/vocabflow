'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isNativePlatform } from '@/lib/platform';
import { Button } from '@/components/ui/Button';

const NATIVE_REDIRECT = 'com.vocabflow.app://auth/callback';

export function EmailAuthForm() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (step === 'otp') {
      otpInputRef.current?.focus();
    }
  }, [step]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo = isNativePlatform()
      ? NATIVE_REDIRECT
      : `${window.location.origin}/auth/callback`;

    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    setLoading(false);

    if (sendError) {
      setError(sendError.message);
    } else {
      setStep('otp');
      setResendCountdown(60);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'email',
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message || 'Invalid or expired code. Please try again.');
    } else {
      router.replace('/');
    }
  }

  async function handleResendCode() {
    if (resendCountdown > 0 || loading) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo = isNativePlatform()
      ? NATIVE_REDIRECT
      : `${window.location.origin}/auth/callback`;

    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    setLoading(false);

    if (sendError) {
      setError(sendError.message);
    } else {
      setResendCountdown(60);
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-5 rounded-2xl border border-ox-danger/30 bg-ox-danger-soft px-4 py-3 text-ox-danger">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em]">Error</p>
          <p className="mt-1 font-serif text-[13px] leading-5">{error}</p>
        </div>
      )}

      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ox-muted">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-ox-border bg-ox-surface px-4 py-3.5 font-serif text-[15px] text-ox-ink-deep placeholder:text-ox-muted/60 focus:border-ox-accent focus:outline-none focus:ring-1 focus:ring-ox-accent"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full py-4 text-[11px] tracking-[0.18em]"
          >
            {loading ? 'Sending code...' : 'Continue with Email'}
          </Button>

          <p className="text-center font-serif text-[13px] leading-6 text-ox-muted">
            We will send a 6-digit code & magic link to your inbox. No password needed.
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="rounded-2xl border border-ox-line bg-ox-surface-alt px-4 py-3 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">Code sent to</p>
              <p className="truncate font-serif text-[14px] text-ox-ink-deep font-medium">{email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setError(null);
              }}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-ox-accent hover:underline shrink-0"
            >
              Change
            </button>
          </div>

          <div>
            <label htmlFor="otp" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ox-muted">
              6-Digit Verification Code
            </label>
            <input
              ref={otpInputRef}
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="mt-2 w-full text-center tracking-[0.4em] font-mono text-[22px] rounded-2xl border border-ox-border bg-ox-surface px-4 py-3.5 text-ox-ink-deep placeholder:text-ox-muted/40 placeholder:tracking-normal focus:border-ox-accent focus:outline-none focus:ring-1 focus:ring-ox-accent"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || otp.length < 6}
            className="w-full py-4 text-[11px] tracking-[0.18em]"
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </Button>

          <div className="flex items-center justify-between pt-1">
            <span className="font-serif text-[13px] text-ox-muted">
              Or click the magic link in your email.
            </span>
            <button
              type="button"
              disabled={resendCountdown > 0 || loading}
              onClick={handleResendCode}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-ox-accent hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : 'Resend code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
