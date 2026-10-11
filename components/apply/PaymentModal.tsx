"use client";

import { useEffect, useState } from "react";
import { CONTACT, PAYMENT } from "@/lib/content";
import type { ApplicationForm } from "@/lib/types";
import { useApp } from "@/components/providers/AppProvider";

type Props = { form: ApplicationForm; onPrint: () => void; onBack: () => void };

export default function PaymentModal({ form, onPrint, onBack }: Props) {
  const { notify } = useApp();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(PAYMENT.accountNumber).then(
      () => setCopied(true),
      () => notify("Copy Failed", `Please copy the account number manually: ${PAYMENT.accountNumber}`, "error"),
    );
  };

  const applicant = `${form.firstName} ${form.surname}`;
  const whatsappText = encodeURIComponent(
    `Hello BSAC, I have made my payment for application under the name ${applicant} for ${form.course}. Attached is my proof of payment.`,
  );
  const emailSubject = encodeURIComponent(`Payment Proof: BSAC Application - ${applicant}`);
  const emailBody = encodeURIComponent(
    `Hello BSAC Team,\n\nI have completed my admission form payment for ${form.course}.\n\nApplicant: ${applicant}\nPhone: ${form.phone}\n\nPlease find attached my payment proof.\n\nThank you.`,
  );

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1.5rem)] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 md:p-8">
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-3"><i className="fas fa-wallet text-3xl" /></div>
          <h3 className="text-2xl font-extrabold text-brand">Do you wish to Pay Now?</h3>
          <p className="text-xs text-gray-500 mt-1">kindly copy the account details below, make your payment and proceed to class.</p>
        </div>
        <div className="bg-cream p-5 rounded-2xl border border-gold/30 mb-6 space-y-3">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Fees Amount: {PAYMENT.fee}</div>
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Account Number</span>
              <span className="text-xl font-extrabold text-gray-800 tracking-wider">{PAYMENT.accountNumber}</span>
            </div>
            <button onClick={copyAccountNumber} className="bg-brand text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-brand-dark transition flex items-center gap-1.5 shadow-sm">
              <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-gray-200">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Account Name</span>
            <span className="text-xs font-bold text-gray-800 leading-snug block mt-0.5">{PAYMENT.accountName} <br /> {PAYMENT.bank}</span>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          <p className="text-xs font-bold text-gray-700 text-center">Share your proof of payment via:</p>
          <div className="grid grid-cols-2 gap-3">
            <a href={`https://wa.me/${CONTACT.whatsapp}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-emerald-600 text-white p-3 rounded-xl font-bold text-xs hover:bg-emerald-700 transition shadow-sm">
              <i className="fab fa-whatsapp text-lg" /> WhatsApp DM
            </a>
            <a href={`mailto:${CONTACT.email}?subject=${emailSubject}&body=${emailBody}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-amber-600 text-white p-3 rounded-xl font-bold text-xs hover:bg-amber-700 transition shadow-sm">
              <i className="fas fa-envelope text-lg" /> Email Proof
            </a>
          </div>
        </div>
        <p className="text-xs text-center text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <i className="fas fa-print mr-1" /> Print your admission form, <strong>keep a copy</strong> for yourself and <strong>submit one copy to the centre</strong>.
        </p>
        </div>
        {/* Buttons stay pinned at the bottom of the modal; only the details above scroll. */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-4 md:px-8 space-y-2">
          <button onClick={onPrint} className="w-full bg-brand text-white py-3.5 rounded-full font-bold hover:bg-brand-dark transition shadow-lg text-sm">PRINT FORM</button>
          <button onClick={onBack} className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition text-xs">Back to Editing Form</button>
        </div>
      </div>
    </div>
  );
}