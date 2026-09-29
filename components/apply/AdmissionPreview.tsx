"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { MOTTO } from "@/lib/content";
import type { AdmittedStudent } from "@/lib/types";

type Props = { student: AdmittedStudent; onRestart: () => void };

const NOTE = "As a faith based institute, our students are expected to conduct themselves in a manner that is pleasing unto the Lord.";

export default function AdmissionPreview({ student, onRestart }: Props) {
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="mt-6">
      <div className="text-center mb-8 no-print flex flex-wrap justify-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
        <div className="w-full mb-2">
          <i className="fas fa-check-circle text-4xl text-emerald-500 mb-2" />
          <h3 className="text-xl font-bold text-gray-800">Application Completed Successfully!</h3>
          <p className="text-xs text-gray-500">You can now print, download, or restart your application below.</p>
        </div>
        <div role="note" className="w-full text-left flex gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
          <i className="fas fa-print text-xl text-amber-700 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-bold">Important: print two copies of your admission form</p>
            <p className="mt-1">Keep one copy for your records and submit the other copy to the BSAC centre at EYN Church Utako, Abuja.</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="bg-brand text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-brand-dark transition flex items-center gap-2">
          <i className="fas fa-print" /> Print / Download Form (A4)
        </button>
        <button onClick={onRestart} className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-900 transition flex items-center gap-2">
          <i className="fas fa-redo" /> Restart Application
        </button>
      </div>

      <div ref={formRef} id="admission-form" className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-200 text-black max-w-[210mm] mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="BSAC Logo" width={80} height={80} className="w-20 h-20 rounded-full object-cover border border-gray-200 shrink-0" />
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-brand tracking-tight uppercase leading-tight">EYN CHURCH OF THE BRETHREN IN NIGERIA LCC UTAKO</h1>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 uppercase leading-snug">BRETHREN SKILLS ACQUISITION CENTER</h2>
            </div>
          </div>
          <div className="w-[110px] h-[135px] border-2 border-gray-800 flex items-center justify-center overflow-hidden relative bg-gray-50 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL passport */}
            <img src={student.passport} className="w-full h-full object-cover" alt="Passport" />
          </div>
        </div>
        <div className="bg-gray-800 text-white text-center py-1.5 font-bold text-lg uppercase tracking-wider mb-6">ADMISSION FORM</div>
        <div className="space-y-4 text-sm leading-relaxed">
          <div className="flex justify-between border-b border-gray-400 pb-1">
            <div><span className="font-bold">Full Name:</span> {[student.firstName, student.middleName, student.surname].filter(Boolean).join(" ")}</div>
            <div><span className="font-bold">Date:</span> {student.today}</div>
          </div>
          <div className="border-b border-gray-400 pb-1"><span className="font-bold">Address:</span> {student.address}</div>
          <div className="grid grid-cols-3 border-b border-gray-400 pb-1">
            <div><span className="font-bold">State of Origin:</span> {student.state}</div>
            <div><span className="font-bold">LGA:</span> {student.lga}</div>
            <div><span className="font-bold">Gender:</span> {student.gender}</div>
          </div>
          <div className="grid grid-cols-2 border-b border-gray-400 pb-1">
            <div><span className="font-bold">Phone:</span> {student.phone}</div>
            <div><span className="font-bold">Email:</span> {student.email}</div>
          </div>
          <div className="border-b border-gray-400 pb-1">
            <span className="font-bold">Skills applied for:</span>{" "}
            <span className="bg-gray-100 px-2 py-0.5 rounded-sm font-semibold text-brand">{student.course}</span>
          </div>
          <div className="border-b border-gray-400 pb-1">
            <span className="font-bold">Any previous skills acquired?</span> {student.hasPreviousSkills || "No"}
            {student.hasPreviousSkills === "Yes" && student.previousSkills && <span> - {student.previousSkills}</span>}
          </div>
          <p className="text-xs italic text-gray-700 pt-2"><strong>Note:</strong> {NOTE}</p>
          <div className="pt-6">
            <div className="bg-gray-800 text-white text-center py-1 font-bold text-sm uppercase tracking-wider mb-4">UNDERTAKING</div>
            <p className="text-xs text-justify leading-relaxed">
              I <span className="font-bold underline px-2">{student.firstName} {student.surname}</span> hereby undertake that as a trainee of the above center will abide by all instructions and pay all the necessary fees of the training.
            </p>
            <div className="flex justify-between items-end mt-12 pt-4">
              <div className="w-1/2 border-t border-black text-center pt-1 text-xs font-bold">Signature</div>
              <div className="w-1/3 border-t border-black text-center pt-1 text-xs font-bold">Date: {student.today}</div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <span className="bg-black text-white text-xs px-4 py-1 font-bold uppercase tracking-widest rounded-full">Motto: {MOTTO}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NOTE as FAITH_NOTE };
