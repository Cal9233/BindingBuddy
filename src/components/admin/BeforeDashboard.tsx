"use client";

import { useState, useEffect } from "react";
import TOTPSetup from "./TOTPSetup";

export default function BeforeDashboard() {
  const [totpEnabled, setTotpEnabled] = useState<boolean | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/admin/totp/status");
        if (res.ok) {
          const data = await res.json();
          setTotpEnabled(data.totpEnabled);
        }
      } catch {
        // ignore
      }
    }
    checkStatus();
  }, []);

  if (totpEnabled === null) return null;

  if (showSetup) {
    return <TOTPSetup initialEnabled={totpEnabled} />;
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto 1.5rem",
        background: totpEnabled
          ? "rgba(34,197,94,0.05)"
          : "rgba(230,57,70,0.05)",
        border: `1px solid ${totpEnabled ? "rgba(34,197,94,0.2)" : "rgba(230,57,70,0.2)"}`,
        borderRadius: 8,
        padding: "0.875rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap" as const,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: totpEnabled ? "#22c55e" : "#E63946",
            display: "inline-block",
          }}
        />
        <span
          style={{
            color: "#F0F0F8",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Two-Factor Authentication:{" "}
          <span style={{ color: totpEnabled ? "#22c55e" : "#E63946" }}>
            {totpEnabled ? "Enabled" : "Disabled"}
          </span>
        </span>
      </div>
      <button
        onClick={() => setShowSetup(true)}
        style={{
          background: totpEnabled ? "#353849" : "#E63946",
          color: totpEnabled ? "#8B8FA8" : "#fff",
          border: totpEnabled ? "1px solid #2A2D3A" : "none",
          borderRadius: 6,
          padding: "0.5rem 1rem",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {totpEnabled ? "Manage 2FA" : "Enable 2FA"}
      </button>
    </div>
  );
}
