"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BACKGROUND_SLIDES, MOTTO } from "@/lib/content";

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((i) => (i + 1) % BACKGROUND_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {BACKGROUND_SLIDES.map((bg, idx) => (
        <div
          key={bg}
          className={`bg-slideshow ${current === idx ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-5">
        <h1 className="text-3xl md:text-6xl font-extrabold mb-4 animate-text tracking-tight">Brethren Skills Acquisition Center</h1>
        <h3 className="text-gold mb-4 text-lg md:text-xl font-semibold animate-text [animation-delay:0.2s]">EYN LCC UTAKO ABUJA</h3>
        <p className="max-w-2xl mb-8 opacity-90 animate-text [animation-delay:0.4s]">{MOTTO}</p>
        <div className="flex gap-4 flex-wrap justify-center animate-text [animation-delay:0.6s]">
          <Link href="/apply" className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 hover:shadow-xl transition">Enrol Now</Link>
          <a href="#courses" className="bg-white text-brand px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition">Explore Courses</a>
        </div>
      </div>
    </section>
  );
}
