import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { ToastContainer } from "@/components/ui/Toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import { BackgroundFootballs3D } from '@/components/dashboard/BackgroundFootballs3D';

export const metadata: Metadata = {
  title: "AEGIS StadiumOS | Smart Stadium Command Center",
  description: "AI-Enabled Event Governance & Intelligent Security Operating System for World Cup-scale venue operations.",
  icons: {
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="12,7.5 15.5,10 14,14 10,14 8.5,10" fill="%23dc2626" fill-opacity="0.25"/><line x1="12" y1="7.5" x2="12" y2="2"/><line x1="15.5" y1="10" x2="20.5" y2="8.5"/><line x1="14" y1="14" x2="18" y2="18"/><line x1="10" y1="14" x2="6" y2="18"/><line x1="8.5" y1="10" x2="3.5" y2="8.5"/></svg>',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <ThemeProvider>
          {/* Layered Animated Background & 3D Footballs */}
          <div className="mesh-gradient-bg" />
          <BackgroundFootballs3D />
          
          <CustomCursor />
          <ToastContainer />
          
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
