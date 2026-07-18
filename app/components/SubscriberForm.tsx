"use client";

import { type FormEvent, useState, useEffect } from "react";
import { User, Mail, Bell } from "lucide-react";
import SubscriptionSuccess from "./SubscriptionSuccess";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Category {
  cqId: number;
  name: string;
}

type SubscriberFormProps = {
  onSuccess?: (message: string) => void;
};

export default function SubscriberForm({ onSuccess }: SubscriberFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  function toggleCategory(cqId: number) {
    setSelectedIds((prev) =>
      prev.includes(cqId) ? prev.filter((id) => id !== cqId) : [...prev, cqId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one job category.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          categoryIds: selectedIds,
        }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 409) {
        throw new Error(data.error || "Unable to save your subscription right now.");
      }

      setSuccessMessage(data.message || "Thanks for subscribing!");
      setName("");
      setEmail("");
      setSelectedIds([]);
      setShowSuccess(true);
      onSuccess?.(data.message || "Thanks for subscribing!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showSuccess) {
    return (
      <SubscriptionSuccess
        message={successMessage}
        onReset={() => setShowSuccess(false)}
      />
    );
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

      {categories.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-left text-sm font-medium text-slate-700">
            Job categories
          </p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {categories.map((cat) => {
              const checked = selectedIds.includes(cat.cqId);
              return (
                <label
                  key={cat.cqId}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    checked
                      ? "border-[#F26722] bg-[#FFF6F1] text-[#F26722]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(cat.cqId)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                      checked
                        ? "border-[#F26722] bg-[#F26722] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checked && "✓"}
                  </span>
                  <span className="truncate text-xs font-medium">{cat.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F26722] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d95a18] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Bell className="h-4 w-4" />
        {isSubmitting ? "Subscribing..." : "Subscribe to Job Alerts"}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-xs text-rose-600" role="status">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
