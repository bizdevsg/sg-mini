import type { Testimonial } from "@/types/landing";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <article className="rounded-[30px] border border-line bg-[linear-gradient(180deg,#111111_0%,#0b0b0b_100%)] p-6 shadow-[0_16px_38px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted font-mono text-lg font-bold text-yellow-500 ring-1 ring-[rgba(215,170,69,0.24)]">
          {initials}
        </div>
        <div>
          <h3 className="font-mono text-lg font-bold text-yellow-500">
            {testimonial.name}
          </h3>
          <p className="text-sm text-foreground/58">{testimonial.role}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-foreground/78">
        {testimonial.quote}
      </p>
    </article>
  );
}
