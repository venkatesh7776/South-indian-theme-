// All copy lives here so it can be edited without touching components.
// NOTE: dates, venue and timings are sample template content — verify before publishing.

export const couple = {
  groom: {
    short: "Vijay",
    full: "Vijay Deverakonda",
    parentsLabel: "Son of",
    parents: "Deverakonda Govardhan Rao & Deverakonda Madhavi",
    photo: "/photos/groom.webp",
  },
  bride: {
    short: "Rashmika",
    full: "Rashmika Mandanna",
    parentsLabel: "Daughter of",
    parents: "Madan Mandanna & Suman Mandanna",
    photo: "/photos/bride.webp",
  },
};

export const wedding = {
  dateLabel: "Monday, 26 October 2026",
  // Muhurtham — confirm exact time + timezone before publishing.
  muhurtham: "2027-02-14T10:24:00+05:30", // sample — set the real muhurtham
  venue: "ITC Mementos",
  city: "Udaipur, Rajasthan, India",
  mapUrl: "https://maps.google.com/?q=ITC+Mementos+Udaipur",
};

export const opening = {
  invocation: "|| Shri Ganeshaya Namaha ||",
  cta: "Open Invitation",
};

export const coupleIntro = {
  title: "The Couple",
  subtitle: "Two families, many blessings, one timeless celebration.",
};

export type JourneyEvent = {
  name: string;
  date: string;
  time: string;
  venue: string;
  blurb: string;
  icon: string;
  mapUrl: string;
};

export const journey = {
  title: "The Wedding Journey",
  subtitle: "Walk with us, function to function, to the sacred hour.",
  events: [
    {
      name: "Mehendi",
      date: "24th October 2026",
      time: "5:00 PM onwards",
      venue: "ITC Mementos, Udaipur",
      blurb: "An evening of colors, music and beautiful traditions as the celebrations begin.",
      icon: "/assets/ev-mehendi.webp",
      mapUrl: wedding.mapUrl,
    },
    {
      name: "Haldi & Sangeet",
      date: "25th October 2026",
      time: "10:48 AM onwards",
      venue: "ITC Mementos, Udaipur",
      blurb: "A joyful celebration filled with laughter, music, dance and the warmth of our loved ones.",
      icon: "/assets/ev-haldi.webp",
      mapUrl: wedding.mapUrl,
    },
    {
      name: "Telugu Wedding",
      date: "26th October 2026",
      time: "10:00 AM onwards",
      venue: "ITC Mementos, Udaipur",
      blurb: "Witness the sacred union of two hearts as we begin our forever with the blessings of our elders.",
      icon: "/assets/ev-wedding.webp",
      mapUrl: wedding.mapUrl,
    },
    {
      name: "Kodava Ceremony",
      date: "26th October 2026",
      time: "6:30 PM onwards",
      venue: "ITC Mementos, Udaipur",
      blurb: "An evening celebrating traditions, family bonds and the beautiful coming together of two cultures.",
      icon: "/assets/ev-kodava.webp",
      mapUrl: wedding.mapUrl,
    },
  ] as JourneyEvent[],
};

export const countdown = {
  title: "The Sacred Hour Is Almost Here",
  subtitle: "Every moment brings us closer to forever.",
};

export const beforeVows = {
  eyebrow: "Before the Vows",
  title: "Little Moments, One Beautiful Journey",
  lead: "Every love story has its own magic.",
  // Replace with the couple's licensed photos when available.
  gallery: ["/photos/moment-1.webp", "/photos/moment-2.webp", "/photos/moment-3.webp", "/photos/moment-4.webp"],
};

export const location = {
  title: "The Wedding Venue",
  subtitle: "Your presence will make our celebration even more special.",
  cta: "Get Directions",
};

export const rsvp = {
  title: "Your Presence Is Our Greatest Gift",
  body: [
    "As we begin this beautiful new chapter, we would love to celebrate with you.",
    "Please let us know if you will be joining us. Your presence and blessings mean the world to us.",
  ],
  options: ["With joy, we will be there", "With regret, we cannot"],
  cta: "Send RSVP",
  thanks: "Thank you for your blessings!",
};

export const closing = {
  title: "We Await Your Gracious Presence",
  line: "And your blessings as we begin our forever.",
  signoff: "With love,",
  names: "Vijay & Rashmika",
  blessing: "Shubhamastu",
  footer: "We look forward to celebrating with you!",
  credit: "Crafted with love for Vijay & Rashmika.",
};
