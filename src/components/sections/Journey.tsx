/* eslint-disable @next/next/no-img-element */
import { journey } from "@/content/wedding";
import { SectionHeading } from "../ui";

/** Four functions as simple, minimal cards. */
export function Journey() {
  return (
    <section id="journey" className="relative py-24 sm:py-32">
      <SectionHeading eyebrow="The Celebrations" title={journey.title} sub={journey.subtitle} />

      <ol className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {journey.events.map((e) => (
          <li key={e.name} data-reveal>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-[#fffaf2]">
              <div className="overflow-hidden" data-reveal-img>
                <img src={e.icon} alt={e.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="t-display text-[1.7rem] leading-tight">{e.name}</h3>
                <p className="mt-2 text-[1rem] text-[var(--ink)]">
                  {e.date} · {e.time}
                </p>
                <p className="mt-3 flex-1 text-[1rem] leading-snug text-[var(--ink)]/80">{e.blurb}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--gold)]/25 pt-4">
                  <span className="text-[0.95rem] text-[var(--ink)]/70">{e.venue}</span>
                  <a href={e.mapUrl} target="_blank" rel="noreferrer" className="btn-outline shrink-0">
                    Map
                  </a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
