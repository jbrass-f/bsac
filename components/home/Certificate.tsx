"use client";

import { useApp } from "@/components/providers/AppProvider";
import SectionTitle from "@/components/SectionTitle";

export default function Certificate() {
  const { notify } = useApp();
  return (
    <section id="certificate" className="px-6 md:px-16 py-24 no-print">
      <SectionTitle>Certificate</SectionTitle>
      <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl text-center shadow-lg">
        <h3 className="font-semibold text-lg mb-3">Certificate Preview</h3>
        <p className="text-gray-600 mb-6">Students who successfully complete the training program will receive an official certification.</p>
        <button
          onClick={() => notify("Info", "Certificate portal will be available upon completion of training.")}
          className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition"
        >
          Get Certificate
        </button>
      </div>
    </section>
  );
}
