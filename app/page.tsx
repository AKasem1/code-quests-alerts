import { Suspense } from "react";
import CodeQuestsLogo from "./components/CodeQuestsLogo";
import SubscriberForm from "./components/SubscriberForm";
import StatusBanner from "./components/StatusBanner";
import { Zap, CheckCircle, Mail, Briefcase, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f0f0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px] md:max-w-[820px]">
        <section className="rounded-3xl bg-white px-5 py-8 shadow-md md:px-8 md:py-10">
          <div className="flex flex-col items-center text-center">
            <CodeQuestsLogo />

            <Suspense>
              <StatusBanner />
            </Suspense>

            <div className="mb-5 flex items-center gap-1.5 rounded-full bg-[#FFF1EB] px-4 py-1.5">
              <Briefcase className="h-3.5 w-3.5 text-[#F26722]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F26722]">
                Job Alerts
              </span>
            </div>

            <h1 className="mb-3 text-[1.35rem] font-extrabold leading-tight text-slate-900 md:text-[1.75rem]">
              Never miss a new opportunity
            </h1>

            <p className="mb-8 max-w-xs text-sm leading-6 text-slate-500">
              Subscribe to get notified when new developer jobs are posted on Code Quests.
            </p>

            <div className="mb-8 grid w-full grid-cols-3 gap-3">
              <FeatureItem
                icon={<Zap className="h-4 w-4 text-[#F26722] md:h-6 md:w-6" strokeWidth={2} />}
                iconBg="bg-[#FFF3E8]"
                title="Instant Alerts"
                description="Get notified as soon as new jobs are posted"
              />
              <FeatureItem
                icon={<CheckCircle className="h-4 w-4 text-emerald-500 md:h-6 md:w-6" strokeWidth={2} />}
                iconBg="bg-emerald-50"
                title="Curated Jobs"
                description="Hand-picked developer opportunities"
              />
              <FeatureItem
                icon={<Mail className="h-4 w-4 text-purple-500 md:h-6 md:w-6" strokeWidth={2} />}
                iconBg="bg-purple-50"
                title="Daily Summary"
                description="Receive a daily digest of new opportunities"
              />
            </div>

            <SubscriberForm />

            <div className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">
              <Shield className="h-3.5 w-3.5 shrink-0" />
              <span>We respect your privacy. Unsubscribe at any time.</span>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureItem({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl md:h-14 md:w-14 md:rounded-2xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="mb-1 text-xs font-semibold text-slate-800">{title}</h3>
      <p className="text-[11px] leading-4 text-slate-500">{description}</p>
    </div>
  );
}
