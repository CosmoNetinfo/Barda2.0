import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Home, Calendar, CheckSquare, Lightbulb, MapPin, Users, BarChart2 } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "I Bardasci",
  description: "Webapp collaborativa per il gruppo I Bardasci",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 pb-20 md:pb-0 md:pl-64`}>
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50">
          <div className="p-6 font-bold text-2xl tracking-tighter">Bardò</div>
          <nav className="flex-1 px-4 space-y-2">
            <NavItem href="/" icon={<Home size={20} />} label="Home" />
            <NavItem href="/events" icon={<Calendar size={20} />} label="Eventi" />
            <NavItem href="/tasks" icon={<CheckSquare size={20} />} label="Task" />
            <NavItem href="/ideas" icon={<Lightbulb size={20} />} label="Idee" />
            <NavItem href="/polls" icon={<BarChart2 size={20} />} label="Sondaggi" />
            <NavItem href="/places" icon={<MapPin size={20} />} label="Luoghi" />
            <NavItem href="/members" icon={<Users size={20} />} label="Membri" />
          </nav>
        </aside>

        {/* Contenuto Principale */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Bottom Navigation Mobile */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 pb-safe">
          <MobileNavItem href="/" icon={<Home size={24} />} label="Home" />
          <MobileNavItem href="/events" icon={<Calendar size={24} />} label="Eventi" />
          <MobileNavItem href="/tasks" icon={<CheckSquare size={24} />} label="Task" />
          <MobileNavItem href="/ideas" icon={<Lightbulb size={24} />} label="Idee" />
          <MobileNavItem href="/menu" icon={<Users size={24} />} label="Menu" />
        </nav>
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

function MobileNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-black">
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
