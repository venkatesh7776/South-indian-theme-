/* eslint-disable @next/next/no-img-element */
import { journey, location, wedding } from "@/content/wedding";
import { SectionHeading } from "../ui";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[var(--gold)]/30 py-3.5 last:border-0">
      <p className="t-caps text-[0.58rem] text-[var(--brass)]">{label}</p>
      <p className="mt-0.5 text-[1.08rem] text-[var(--ink)]">{value}</p>
    </div>
  );
}

export function Location() {
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(`${wedding.venue}, ${wedding.city}`)}&output=embed`;
  const main = journey.events.find((e) => e.name === "Telugu Wedding") ?? journey.events[0];
  return (
    <section id="location" className="relative py-24 sm:py-32">
      <SectionHeading eyebrow="Location & Directions" title={location.title} sub={location.subtitle} />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl" data-reveal-img>
          <img src="/assets/venue-photo.webp" alt={`${wedding.venue} — wedding venue`} className="h-full max-h-[620px] w-full object-cover" loading="lazy" />
        </div>

        <div data-reveal className="flex flex-col rounded-2xl border border-[var(--gold)]/40 bg-[#fffaf2] p-7 shadow-[0_18px_40px_-28px_rgba(94,52,39,0.55)] sm:p-9">
          <h3 className="t-display text-[2.4rem] leading-tight">{wedding.venue}</h3>
          <p className="mt-1 text-[1.05rem] text-[var(--ink)]/80">{wedding.city}</p>
          <div className="mt-5">
            <Row label="Muhurtham" value={`${wedding.dateLabel} · ${main.time}`} />
            <Row label="Celebrations" value="24 – 26 October 2026" />
          </div>
          <div className="mt-5 flex-1 overflow-hidden rounded-xl border border-[var(--gold)]/40">
            <iframe title={`Map to ${wedding.venue}`} src={embed} className="block h-56 min-h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <a href={wedding.mapUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full">
            {location.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
