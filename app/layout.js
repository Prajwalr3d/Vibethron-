import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "../spa/index.css";

const display = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["600", "700"] });
const body = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });

export const metadata = {
  title: "INTENT / SHIFT: AI communication transformer with IntentLock",
  description:
    "Rewrite a rough message for executive, supportive, legal or Gen-Z readers, and prove that its facts, deadlines, conditions and intent survived.",
};

export const viewport = { themeColor: "#0B0B0B", colorScheme: "dark" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
