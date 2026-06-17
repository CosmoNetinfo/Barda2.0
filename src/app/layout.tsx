import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import AppLayoutWrapper from "./components/AppLayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

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
  let consentAcceptedAt: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, consent_accepted_at')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (profile.role) role = profile.role;
      if (profile.consent_accepted_at) {
        consentAcceptedAt = profile.consent_accepted_at;
      }
    }
  }

  return (
    <html lang="it">
      <body className={`${inter.variable} ${barlowCondensed.variable} font-sans antialiased bg-gray-50`}>
        {/* Barra decorativa in alto */}
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-rose-500 to-orange-500 z-[100]" />
        
        <AppLayoutWrapper role={role} hasUser={!!user} consentAcceptedAt={consentAcceptedAt}>
          {children}
        </AppLayoutWrapper>
      </body>
    </html>
  );
}

