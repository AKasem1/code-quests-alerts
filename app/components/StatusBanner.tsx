"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

const messages: Record<string, { text: string; type: "success" | "warning" | "info" }> = {
  unsubscribed: {
    text: "You have been successfully unsubscribed from Code Quests Job Alerts.",
    type: "success",
  },
  "already-unsubscribed": {
    text: "You are already unsubscribed.",
    type: "info",
  },
  "not-found": {
    text: "We couldn't find your subscription.",
    type: "warning",
  },
  invalid: {
    text: "The unsubscribe link is invalid or has expired.",
    type: "warning",
  },
  error: {
    text: "Something went wrong. Please try again later.",
    type: "warning",
  },
};

const styles = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />,
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />,
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: <Info className="h-4 w-4 shrink-0 text-blue-500" />,
  },
};

export default function StatusBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (!status || !messages[status]) return null;

  const { text, type } = messages[status];
  const style = styles[type];

  return (
    <div className={`mb-6 flex w-full items-center gap-2 rounded-xl border px-4 py-3 ${style.bg}`}>
      {style.icon}
      <p className={`text-sm ${style.text}`}>{text}</p>
    </div>
  );
}
