import { AudioProvider } from "@/components/AudioProvider";
import { MusicToggle } from "@/components/MusicToggle";
import { OpeningGate } from "@/components/OpeningGate";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { KolamBand, Reveals } from "@/components/ui";
import { Couple } from "@/components/sections/Couple";
import { Journey } from "@/components/sections/Journey";
import { Countdown } from "@/components/sections/Countdown";
import { BeforeVows } from "@/components/sections/BeforeVows";
import { Location } from "@/components/sections/Location";
import { Rsvp } from "@/components/sections/Rsvp";
import { Closing } from "@/components/sections/Closing";

export default function Home() {
  return (
    <AudioProvider>
      <SmoothScroll />
      <Reveals />
      <OpeningGate />
      <MusicToggle />
      <main>
        <Hero />
        <Couple />
        <KolamBand className="mt-16 sm:mt-24" />
        <Journey />
        <Countdown />
        <BeforeVows />
        <KolamBand />
        <Location />
        <Rsvp />
      </main>
      <Closing />
    </AudioProvider>
  );
}
