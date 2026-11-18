"use client";

import { useState } from "react";
import { rsvp } from "@/content/wedding";
import { riceShower, SectionHeading } from "../ui";

export function Rsvp() {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!choice || !name.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), response: choice }) });
      if (!res.ok) throw new Error();
      setState("done");
      if (choice === rsvp.options[0]) riceShower();
    } catch {
      setState("error");
    }
  };

  return (
    <section id="rsvp" className="relative py-24 sm:py-32">
      <SectionHeading eyebrow="RSVP" title={rsvp.title} sub={rsvp.body[1]} />

      <form onSubmit={submit} className="mx-5 max-w-lg rounded-2xl sm:mx-auto border border-[var(--gold)]/40 bg-[#fffaf2] p-7 shadow-[0_18px_40px_-28px_rgba(94,52,39,0.55)] sm:p-9" data-reveal>
        {state === "done" ? (
          <div className="py-8 text-center" role="status">
            <p className="t-display text-[2rem]">Thank you</p>
            <p className="mt-2 text-[1.05rem] text-[var(--ink)]/85">{rsvp.thanks}</p>
          </div>
        ) : (
          <>
            <label className="block">
              <span className="t-caps text-[0.6rem] text-[var(--brass)]">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="mt-2 w-full rounded-lg border border-[var(--gold)]/50 bg-white px-4 py-3 text-[1.05rem] outline-none focus:border-[var(--rose)]" />
            </label>
            <fieldset className="mt-6">
              <legend className="t-caps mb-2 text-[0.6rem] text-[var(--brass)]">Will you attend?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {rsvp.options.map((o) => (
                  <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${choice === o ? "border-[var(--rose)] bg-[rgba(164,100,76,0.08)]" : "border-[var(--gold)]/50 bg-white"}`}>
                    <input type="radio" name="rsvp" value={o} checked={choice === o} onChange={() => setChoice(o)} className="accent-[var(--rose)]" />
                    <span className="text-[1rem] leading-tight">{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" disabled={!choice || !name.trim() || state === "sending"} className="btn-primary mt-7 w-full disabled:opacity-50">
              {state === "sending" ? "Sending…" : rsvp.cta}
            </button>
            {state === "error" && <p className="mt-3 text-center text-sm text-[var(--kumkum)]">Could not send right now — please try again.</p>}
          </>
        )}
      </form>
    </section>
  );
}
