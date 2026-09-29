"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/content";

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 z-[9999] py-2 px-2 flex justify-around items-center shadow-lg no-print">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center transition px-2 py-1 rounded-lg ${pathname === item.href ? "text-brand" : "text-gray-600"}`}
        >
          <i className={`fas ${item.icon} text-xl`} />
          <span className="text-[10px] font-bold uppercase mt-1">{item.navLabel}</span>
        </Link>
      ))}
    </nav>
  );
}
