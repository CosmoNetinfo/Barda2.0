import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, Calendar, CheckSquare, Lightbulb, MapPin, Users, BarChart2, User } from "lucide-react";
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
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50">
          <div className="p-6 flex items-center gap-3">
            <img src="/bardasci-logo.png" alt="Logo" className="h-12 object-contain" />
            <span className="font-barlow font-bold text-3xl tracking-tight text-primary">Bardò</span>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-2">
            <NavItem href="/" icon={<Home size={20} />} label="Home" />
            <NavItem href="/events" icon={<Calendar size={20} />} label="Eventi" />
            <NavItem href="/tasks" icon={<CheckSquare size={20} />} label="Task" />
            <NavItem href="/ideas" icon={<Lightbulb size={20} />} label="Idee" />
            <NavItem href="/polls" icon={<BarChart2 size={20} />} label="Sondaggi" />
            <NavItem href="/places" icon={<MapPin size={20} />} label="Luoghi" />
            <NavItem href="/members" icon={<Users size={20} />} label="Membri" />
            <NavItem href="/profile" icon={<User size={20} />} label="Profilo" />
            {role === 'founder' && (
              <NavItem href="/admin/debug" icon={<BarChart2 size={20} className="text-rose-500" />} label="Debug" />
            )}
          </nav>
        </aside>

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

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-colors font-medium">
      {icon}
      <span>{label}</span>
    </Link>
  );
}
