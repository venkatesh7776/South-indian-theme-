import { beforeVows } from "@/content/wedding";
import { Photo, SectionHeading } from "../ui";

/** A simple, even photo grid. */
export function BeforeVows() {
  return (
    <section id="moments" className="relative py-24 sm:py-32">
      <SectionHeading eyebrow={beforeVows.eyebrow} title={beforeVows.title} sub={beforeVows.lead} />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 sm:gap-5 lg:grid-cols-4">
        {beforeVows.gallery.map((src, i) => (
          <figure key={src} className="overflow-hidden rounded-xl bg-[var(--cream-deep)]" data-reveal-img>
            <Photo src={src} alt={`Moment ${i + 1}`} className="aspect-[4/5] w-full transition-transform duration-700 hover:scale-[1.04]" />
          </figure>
        ))}
      </div>
    </section>
  );
}
