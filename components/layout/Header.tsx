"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HEADER_TEXTS, NAV_ITEMS } from "@/lib/content";
import { useApp } from "@/components/providers/AppProvider";

const FADE_MS = 400;

function RotatingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % HEADER_TEXTS.length);
        setVisible(true);
      }, FADE_MS);
    }, 3500);
    return () => { clearInterval(timer); clearTimeout(swap); };
  }, []);

  return (
    <span
      className={`text-xs md:text-sm font-bold text-cream tracking-tight block truncate transition duration-[400ms] ease-in-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {HEADER_TEXTS[index]}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { canInstall, isInstalled, installApp } = useApp();

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-brand border-b border-brand-dark shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image src="/logo.png" alt="BSAC Logo" width={44} height={44} preload className="h-11 w-11 rounded-full object-cover shadow-sm border border-white/20 shrink-0" />
          <div className="h-8 overflow-hidden flex items-center min-w-0">
            <RotatingText />
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const isConnect = item.href === "/connect";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isConnect
                    ? `text-xs font-semibold transition inline-flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-white/10 ${active ? "text-white bg-white/15" : "text-cream/90 hover:text-white"}`
                    : `text-xs font-semibold transition hidden sm:inline-flex items-center gap-1.5 ${active ? "text-white underline underline-offset-4" : "text-cream/90 hover:text-white"}`
                }
              >
                <i className={`fas ${item.icon}`} /> <span className={isConnect ? "hidden sm:inline" : undefined}>{item.navLabel}</span>
              </Link>
            );
          })}

          {canInstall ? (
            <button onClick={installApp} className="install-btn-pulse bg-gold text-ink text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gold-dark transition flex items-center gap-1.5 shadow-sm">
              <i className="fas fa-download" /> <span className="hidden sm:inline">Install App</span>
            </button>
          ) : isInstalled ? (
            <span className="text-[10px] text-cream/80 font-semibold hidden sm:inline-flex items-center gap-1">
              <i className="fas fa-check-circle text-gold" /> Installed
            </span>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
