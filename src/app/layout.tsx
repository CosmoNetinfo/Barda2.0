import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

import DesktopSidebar from "./components/DesktopSidebar";
import GlobalMobileNav from "./components/GlobalMobileNav";
import GlobalFAB from "./components/GlobalFAB";

export const metadata: Metadata = {
  title: "I Bardasci",
  description: "Webapp collaborativa per il gruppo I Bardasci",
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = 'user';
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role) role = profile.role;
  }

  return (
    <html lang="it">
      <body className={`${inter.variable} ${barlowCondensed.variable} font-sans antialiased bg-gray-50 pb-20 md:pb-0 md:pl-64`}>
        {/* Barra decorativa in alto */}
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-rose-500 to-orange-500 z-[100]" />
        
        <DesktopSidebar role={role} />

        {/* Contenuto Principale */}
        <main className="min-h-screen">
          {children}
        </main>

        <GlobalFAB />
        <GlobalMobileNav role={role} />
      </body>
    </html>
  );
}
