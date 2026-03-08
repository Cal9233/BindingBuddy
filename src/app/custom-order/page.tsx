"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function CustomOrderPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-brand-purple/10 border border-brand-purple/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-black text-brand-text mb-3">Coming Soon!</h1>
        <p className="text-brand-muted mb-8">
          Custom order submissions aren&apos;t live yet — but this is exactly where they&apos;ll land. Check back soon!
        </p>
        <Link
          href="/"
          className="font-display bg-brand-gold text-brand-bg font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs text-brand-red font-semibold uppercase tracking-widest">Linework Orders Only</span>
        <h1 className="font-display text-4xl font-black text-brand-text mt-2 mb-3">
          Custom Design Order
        </h1>
        <p className="text-brand-muted leading-relaxed">
          Submit your reference design and we&apos;ll laser-engrave it onto your binder using xTool precision.
        </p>
      </div>

      {/* Black/white notice */}
      <div className="bg-brand-gold/5 border border-brand-gold/30 rounded-2xl px-5 py-4 mb-8 flex gap-3">
        <svg className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="text-brand-gold font-semibold mb-0.5">Black &amp; White Linework Only</p>
          <p className="text-brand-muted">
            Laser engraving works in contrast — not color. Submitted designs must be clean black &amp; white linework.
            Color references, photographs, gradients, and filled shapes cannot be engraved.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-brand-card border border-white/5 rounded-2xl p-6 space-y-6">

        {/* Image upload */}
        <div>
          <label className="block text-brand-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Reference Design
          </label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-white/10 hover:border-brand-purple/40 rounded-xl p-8 text-center transition-colors group"
          >
            <svg
              className="w-10 h-10 text-brand-muted/40 group-hover:text-brand-purple/60 mx-auto mb-3 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {fileName ? (
              <p className="text-brand-text font-semibold text-sm">{fileName}</p>
            ) : (
              <>
                <p className="text-brand-text text-sm font-semibold">Click to upload your design</p>
                <p className="text-brand-muted text-xs mt-1">PNG, JPG, SVG, or PDF — black &amp; white linework only</p>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf,.svg"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-brand-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Design Requirements
          </label>
          <textarea
            rows={5}
            placeholder="Describe your design — which Pokemon, what style (outline only / detailed linework), binder type, placement notes, or anything else we should know."
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-gold/40 transition-colors text-sm resize-none"
          />
        </div>

        {/* Contact email */}
        <div>
          <label className="block text-brand-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Your Email
          </label>
          <input
            type="email"
            placeholder="ash@pallettown.com"
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-gold/40 transition-colors text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="font-display w-full bg-brand-gold text-brand-bg font-bold py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Submit Custom Order Request
        </button>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-text text-sm transition-colors mt-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to shop
      </Link>
    </div>
  );
}
