"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function MFAVerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user actually has TOTP enabled
    async function checkStatus() {
      try {
        const res = await fetch("/api/admin/totp/status");
        if (!res.ok) {
          // Not logged in — go to admin login
          window.location.href = "/admin";
          return;
        }
        const data = await res.json();
        if (!data.totpEnabled || data.totpVerified) {
          // TOTP not enabled or already verified — go to dashboard
          window.location.href = "/admin";
          return;
        }
        setChecking(false);
      } catch {
        window.location.href = "/admin";
      }
    }
    checkStatus();
  }, []);

  async function handleVerify() {
    if (code.length !== 6) {
      setError("Enter a 6-digit code");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: code, action: "verify" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid code");
        setCode("");
        return;
      }
      // Cookie is set by the API — redirect to admin
      window.location.href = "/admin";
    } catch {
      setError("Failed to verify");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-poke-dark flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-poke-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-poke-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-poke-blue opacity-[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-poke-yellow opacity-[0.03] rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full max-w-[420px] bg-poke-card border border-poke-border rounded-2xl p-8 shadow-2xl shadow-black/40">
        {/* Logo + branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/images/logo.png"
              alt="Binding Buddy"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-display font-bold text-xl text-poke-text">
              Binding<span className="text-poke-yellow">Buddy</span>
            </span>
          </div>

          {/* Lock icon */}
          <div className="w-14 h-14 rounded-full bg-poke-blue/20 border border-poke-blue/40 flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-poke-blue"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>

          <h1 className="font-display text-2xl font-bold text-poke-text mb-1">
            Two-Factor Authentication
          </h1>
          <p className="text-poke-muted text-sm">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Code input */}
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          className="w-full h-14 bg-poke-dark border border-poke-border rounded-xl text-poke-text text-2xl font-mono tracking-[0.4em] text-center placeholder-poke-muted/30 focus:outline-none focus:border-poke-blue/50 transition-colors mb-4"
        />

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
          className={`font-display w-full h-12 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
            loading || code.length !== 6
              ? "bg-poke-yellow/50 text-white/50 cursor-not-allowed"
              : "bg-poke-yellow text-white hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <p className="text-poke-muted/50 text-xs text-center mt-6">
          Open your authenticator app to find your verification code.
        </p>
      </div>
    </div>
  );
}
