"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GALLERY, type GalleryImage } from "@/lib/content";
import SectionTitle from "@/components/SectionTitle";

export default function Gallery() {
  const [expanded, setExpanded] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <section id="gallery" className="px-6 md:px-16 py-24 no-print">
      <SectionTitle>Training Gallery</SectionTitle>
      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
        {GALLERY.map((img) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setExpanded(img)}
            className="relative group overflow-hidden rounded-2xl shadow-lg bg-white h-48 md:h-72"
          >
            <Image src={img.src} alt={img.title} fill sizes="(min-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <span className="text-white text-xs md:text-sm font-semibold">{img.title}</span>
            </div>
          </button>
        ))}
      </div>

      {expanded && (
        <div onClick={() => setExpanded(null)} className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4 cursor-pointer">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- natural-size lightbox image */}
            <img src={expanded.src} alt={expanded.title} className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" />
            <p className="text-white mt-4 font-semibold text-lg">{expanded.title}</p>
            <span className="text-gray-400 text-xs mt-1">Click anywhere to close</span>
          </div>
        </div>
      )}
    </section>
  );
}
