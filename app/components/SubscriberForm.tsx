"use client";

import { type FormEvent, useState } from "react";
import { User, Mail, Bell } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscriberFormProps = {
  onSuccess?: (message: string) => void;
};

export default function SubscriberForm({ onSuccess }: SubscriberFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setStatus("error");
      setMessage("Please enter your name.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 409) {
        throw new Error(data.error || "Unable to save your subscription right now.");
      }

      setStatus("success");
      setMessage(data.message || "Thanks for subscribing!");
      setName("");
      setEmail("");
      onSuccess?.(data.message || "Thanks for subscribing!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error";
      setStatus("error");
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="name" className="mb-1.5 block text-left text-sm font-medium text-slate-700">
          Full name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#F26722] focus:ring-2 focus:ring-[#F26722]/20"
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="mb-1.5 block text-left text-sm font-medium text-slate-700">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#F26722] focus:ring-2 focus:ring-[#F26722]/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F26722] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d95a18] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Bell className="h-4 w-4" />
        {isSubmitting ? "Subscribing..." : "Subscribe to Job Alerts"}
      </button>

      {message ? (
        <p
          className={`mt-3 text-xs ${status === "success" ? "text-emerald-600" : "text-rose-600"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
