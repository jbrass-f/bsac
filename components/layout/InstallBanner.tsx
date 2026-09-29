"use client";

import Image from "next/image";
import { useApp } from "@/components/providers/AppProvider";

export default function InstallBanner() {
  const { showInstallBanner, installApp, dismissInstallBanner } = useApp();
  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[9990] px-4 no-print pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto install-banner-enter">
        <div className="bg-white rounded-2xl shadow-2xl border border-gold/40 p-4 flex items-center gap-3">
          <Image src="/app.png" alt="BSAC" width={48} height={48} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 leading-tight">Install BSAC App</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Add to home screen for quick access</p>
          </div>
          <button onClick={installApp} className="install-btn-pulse bg-brand text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-brand-dark transition shrink-0 shadow-sm">Install</button>
          <button onClick={dismissInstallBanner} aria-label="Dismiss" className="text-gray-400 hover:text-gray-600 p-1 shrink-0"><i className="fas fa-times" /></button>
        </div>
      </div>
    </div>
  );
}
