"use client";

type ClientAreaReferralStepsCardProps = {
  steps: string[];
  title: string;
};

export function ClientAreaReferralStepsCard({
  steps,
  title,
}: ClientAreaReferralStepsCardProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-900/90">
      <div className="border-b border-zinc-800 px-5 py-5 text-center sm:px-7">
        <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
      </div>

      <div className="divide-y divide-dashed divide-yellow-500/40">
        {steps.map((step, index) => (
          <div
            key={step}
            className="grid gap-3 px-5 py-5 sm:grid-cols-[40px_minmax(0,1fr)] sm:items-center sm:px-7"
          >
            <span className="text-3xl font-black text-yellow-400">
              {index + 1}
            </span>
            <p className="text-sm leading-7 text-zinc-200 sm:text-base">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
