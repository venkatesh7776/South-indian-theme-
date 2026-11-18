import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Gloock, Marcellus } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif" });
const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const caps = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-caps" });

export const metadata: Metadata = {
  title: "Vijay & Rashmika — Wedding Invitation",
  description: "A South Indian Telugu wedding invitation.",
};

export const viewport: Viewport = {
  themeColor: "#FBF3E2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`gate-closed ${serif.variable} ${display.variable} ${caps.variable}`}>
      <body>{children}</body>
    </html>
  );
}
