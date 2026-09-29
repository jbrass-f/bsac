"use client";

import { useState } from "react";
import { FAQS } from "@/lib/content";
import SectionTitle from "@/components/SectionTitle";

export default function Faq() {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (idx: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });

  return (
    <section id="faq" className="px-6 md:px-16 py-24 no-print">
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      <div className="max-w-3xl mx-auto space-y-4">
        {FAQS.map((item, idx) => {
          const isOpen = open.has(idx);
          return (
            <div key={item.q} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full text-left p-5 font-semibold flex justify-between items-center text-gray-800"
              >
                <span>{item.q}</span>
                <i className={isOpen ? "fas fa-chevron-up text-brand" : "fas fa-chevron-down text-gray-400"} />
              </button>
              {isOpen && <div className="px-5 pb-5 text-gray-600 border-t pt-3 text-sm">{item.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
