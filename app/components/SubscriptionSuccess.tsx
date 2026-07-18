import { CircleCheck } from "lucide-react";

export default function SubscriptionSuccess({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="flex w-full animate-fade-in flex-col items-center py-6">
      <div className="mb-4 animate-scale-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CircleCheck className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="mb-2 animate-fade-in-up text-xl font-bold text-slate-900">
        You're all set!
      </h2>
      <p className="mb-6 animate-fade-in-up text-sm text-slate-500 [animation-delay:100ms]">
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="animate-fade-in-up cursor-pointer text-sm font-medium text-[#F26722] transition hover:underline [animation-delay:200ms]"
      >
        Subscribe another email
      </button>
    </div>
  );
}
