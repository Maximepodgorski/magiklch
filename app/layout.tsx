import type { Metadata } from "next";
import { DM_Sans, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { AppSidebar, MobileSidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://magiklch.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Magiklch — OKLCH Palette Generator",
    template: "%s — Magiklch",
  },
  description:
    "Free OKLCH color palette generator. Input any CSS color, get 11 perceptually uniform shades with APCA contrast scores. Export as HEX, HSL, OKLCH, or CSS variables.",
  keywords: [
    "OKLCH",
    "color palette generator",
    "OKLCH palette",
    "color shades",
    "APCA contrast",
    "CSS colors",
    "Tailwind colors",
    "perceptual uniformity",
    "wide gamut",
    "P3 colors",
    "color tool",
  ],
  authors: [{ name: "Magiklch" }],
  creator: "Magiklch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Magiklch",
    title: "Magiklch — OKLCH Palette Generator",
    description:
      "Free OKLCH color palette generator. Input any CSS color, get 11 perceptually uniform shades with APCA contrast scores.",
  },
  twitter: {
    card: "summary",
    title: "Magiklch — OKLCH Palette Generator",
    description:
      "Free OKLCH color palette generator. 11 perceptually uniform shades, APCA contrast, wide gamut support.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SidebarProvider>
              <div className="flex h-svh flex-col overflow-hidden">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                  <AppSidebar />
                  <MobileSidebar />
                  <main
                    id="main-content"
                    className="flex flex-1 flex-col overflow-y-auto"
                  >
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
