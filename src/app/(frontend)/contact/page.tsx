"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  binderType: z.string().min(1, "Please select a binder type"),
  message: z.string().min(10, "Please describe your design (at least 10 characters)"),
});

type ContactForm = z.infer<typeof contactSchema>;

const inputClass =
  "w-full bg-white/5 border border-poke-border rounded-xl px-4 py-3 text-poke-text placeholder-poke-muted/60 focus:outline-none focus:border-poke-blue/50 transition-colors text-sm";

const labelClass =
  "block text-poke-muted text-xs font-semibold uppercase tracking-wider mb-1.5";

const errorClass = "text-red-400 text-xs mt-1";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to submit");
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-poke-blue/20 border border-poke-blue/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-poke-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-poke-text mb-3">
          Request Received!
        </h1>
        <p className="text-poke-muted mb-8">
          We&apos;ll review your custom order request and get back to you within
          1–2 business days.
        </p>
        <Button href="/" variant="primary">
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <span className="text-xs text-poke-blue font-semibold uppercase tracking-widest">
          Custom Orders
        </span>
        <h1 className="font-display text-4xl font-bold text-poke-text mt-2 mb-3 tracking-tight">
          Custom Design Request
        </h1>
        <p className="text-poke-muted leading-relaxed">
          Submit your reference design and we&apos;ll laser-engrave it onto your
          binder using xTool precision.
        </p>
      </div>

      {/* Notice */}
      <div className="bg-poke-yellow/5 border border-poke-yellow/30 rounded-2xl px-5 py-4 mb-8 flex gap-3">
        <svg
          className="w-5 h-5 text-poke-yellow flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm">
          <p className="text-poke-yellow font-semibold mb-0.5">
            Black &amp; White Linework Only
          </p>
          <p className="text-poke-muted">
            Laser engraving works in contrast — not color. Submitted designs
            must be clean black &amp; white linework.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-poke-card border border-poke-border rounded-2xl p-6 space-y-6"
      >
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              placeholder="Your name"
              className={inputClass}
              {...register("name")}
            />
            {errors.name && (
              <p className={errorClass}>{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email")}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Binder type */}
        <div>
          <label className={labelClass}>Binder Type</label>
          <select className={inputClass} {...register("binderType")}>
            <option value="">Select binder type...</option>
            <option value="9-Pocket">9-Pocket Binder</option>
            <option value="Zipper">Zipper Binder</option>
            <option value="Side-Load">Side-Load Binder</option>
            <option value="Other">Other / Not Sure</option>
          </select>
          {errors.binderType && (
            <p className={errorClass}>{errors.binderType.message}</p>
          )}
        </div>

        {/* File upload (client-side only for now) */}
        <div>
          <label className={labelClass}>Reference Design (optional)</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-poke-border hover:border-poke-blue/40 rounded-xl p-6 text-center transition-colors group"
          >
            <svg
              className="w-8 h-8 text-poke-muted/40 group-hover:text-poke-blue/60 mx-auto mb-2 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            {fileName ? (
              <p className="text-poke-text font-semibold text-sm">{fileName}</p>
            ) : (
              <>
                <p className="text-poke-text text-sm font-semibold">
                  Click to upload
                </p>
                <p className="text-poke-muted text-xs mt-1">
                  PNG, JPG, SVG, or PDF — B&amp;W linework only
                </p>
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

        {/* Message */}
        <div>
          <label className={labelClass}>Design Requirements</label>
          <textarea
            rows={5}
            placeholder="Describe your design — which Pokemon, style, placement, and anything else we should know."
            className={`${inputClass} resize-none`}
            {...register("message")}
          />
          {errors.message && (
            <p className={errorClass}>{errors.message.message}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full justify-center py-4"
        >
          {loading ? "Submitting..." : "Submit Custom Order Request"}
        </Button>
      </form>
    </div>
  );
}
