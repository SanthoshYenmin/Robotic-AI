import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/layout/SmoothScroller";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalCanvas from "@/components/three/GlobalCanvas";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVA ROBOTICS | Intelligence, Built to Move",
  description: "Humanoid intelligence designed for the physical world. Nova Robotics builds general-purpose humanoid robots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <body className="antialiased bg-[#0a0a0a] text-[#f2f2f2]">
        <GlobalCanvas />
        <SmoothScroller>
          <Navbar />
          <main className="w-full">{children}</main>
          <Footer />
        </SmoothScroller>
      </body>
    </html>
  );
}
