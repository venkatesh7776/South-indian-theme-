# South-indian-theme-

**Vijay & Rashmika Wedding** — a South Indian (Telugu) temple-themed wedding invitation website.

Built with Next.js, GSAP ScrollTrigger and Lenis smooth scrolling.

## Highlights
- Opening card that draws a muggu (kolam) line by line, then blooms into the site; music starts on "Open Invitation".
- Pinned hero: painted sky with drifting clouds, mango-leaf thoranam, banana leaves and the Srikalahasti gopuram rising on scroll.
- Paper scroll invitation that unrolls to reveal the couple.
- Celebrations, muhurtham countdown, photo moments, venue, RSVP and a kolam-bordered footer.

## Run locally
```bash
npm install
npm run dev
```

## Editing content
All names, dates, venue and copy live in `src/content/wedding.ts`. Photos are in `public/photos/`, artwork in `public/assets/`.

> Dates, venue and timings are sample content — verify before sharing. RSVPs are written to `data/rsvps.jsonl` locally; on Vercel they appear in the function logs (connect a database or sheet for permanent storage).
