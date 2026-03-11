"use client";

import { useState } from "react";

type Step = "idle" | "scanning" | "verifying" | "enabled" | "disabling";

export default function TOTPSetup({
  initialEnabled,
}: {
  initialEnabled: boolean;
}) {
  const [step, setStep] = useState<Step>(initialEnabled ? "enabled" : "idle");
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSetup() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/totp/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Setup failed");
        return;
      }
      setQrDataURL(data.qrDataURL);
      setStep("scanning");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

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
        body: JSON.stringify({ token: code, action: "enable" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }
      setStep("enabled");
      setQrDataURL(null);
      setCode("");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable() {
    if (code.length !== 6) {
      setError("Enter your current 6-digit code to disable");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/totp/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to disable");
        return;
      }
      setStep("idle");
      setCode("");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "2rem auto",
        background: "#1A1D27",
        border: "1px solid #2A2D3A",
        borderRadius: 12,
        padding: "2rem",
      }}
    >
      <h2
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "#F0F0F8",
          marginBottom: "1rem",
        }}
      >
        Two-Factor Authentication
      </h2>

      {error && (
        <div
          style={{
            background: "rgba(230,57,70,0.1)",
            border: "1px solid rgba(230,57,70,0.3)",
            color: "#E63946",
            borderRadius: 8,
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {step === "idle" && (
        <>
          <p style={{ color: "#8B8FA8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Add an extra layer of security to your account by enabling
            two-factor authentication with an authenticator app.
          </p>
          <button
            onClick={handleSetup}
            disabled={loading}
            style={{
              background: "#E63946",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.75rem 1.5rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Setting up..." : "Enable 2FA"}
          </button>
        </>
      )}

      {step === "scanning" && qrDataURL && (
        <>
          <p style={{ color: "#8B8FA8", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Scan this QR code with your authenticator app (Google Authenticator,
            Authy, etc.), then enter the 6-digit code below.
          </p>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataURL}
              alt="TOTP QR Code"
              style={{
                width: 200,
                height: 200,
                borderRadius: 8,
                background: "#fff",
                padding: 8,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              style={{
                flex: 1,
                height: 44,
                background: "#0F1117",
                border: "1px solid #2A2D3A",
                borderRadius: 8,
                padding: "0 1rem",
                color: "#F0F0F8",
                fontSize: "1.25rem",
                fontFamily: "monospace",
                letterSpacing: "0.3em",
                textAlign: "center",
              }}
            />
            <button
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              style={{
                background: "#E63946",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0 1.5rem",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                textTransform: "uppercase" as const,
                cursor: loading || code.length !== 6 ? "not-allowed" : "pointer",
                opacity: loading || code.length !== 6 ? 0.6 : 1,
              }}
            >
              {loading ? "..." : "Verify"}
            </button>
          </div>
        </>
      )}

      {step === "enabled" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "0.875rem" }}>
              Two-factor authentication is enabled
            </span>
          </div>
          <p style={{ color: "#8B8FA8", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Enter a current code from your authenticator app to disable 2FA.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              style={{
                flex: 1,
                height: 44,
                background: "#0F1117",
                border: "1px solid #2A2D3A",
                borderRadius: 8,
                padding: "0 1rem",
                color: "#F0F0F8",
                fontSize: "1.25rem",
                fontFamily: "monospace",
                letterSpacing: "0.3em",
                textAlign: "center",
              }}
            />
            <button
              onClick={handleDisable}
              disabled={loading || code.length !== 6}
              style={{
                background: "#353849",
                color: "#8B8FA8",
                border: "1px solid #2A2D3A",
                borderRadius: 8,
                padding: "0 1.5rem",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                textTransform: "uppercase" as const,
                cursor: loading || code.length !== 6 ? "not-allowed" : "pointer",
                opacity: loading || code.length !== 6 ? 0.6 : 1,
              }}
            >
              {loading ? "..." : "Disable 2FA"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
