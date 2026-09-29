import type { Metadata } from "next";
import { PageHeader } from "@/components/SectionTitle";
import { ADMINS, CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Connect | BSAC Community",
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader title="Connect with BSAC" subtitle="Reach our administrators directly for admissions and enquiries." tag="Contact" />

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-user-shield text-brand" /> Admins</h2>
          <div className="space-y-3">
            {ADMINS.map((admin) => (
              <div key={admin.id} className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg">{admin.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800">{admin.name}</p>
                  <p className="text-xs text-gray-500">{admin.role}</p>
                </div>
                <a href={`https://wa.me/${admin.wa}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-full hover:bg-emerald-700 transition">
                  <i className="fab fa-whatsapp" /> WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
          <p className="text-sm text-gray-600 mb-4">Prefer email or phone?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full text-sm font-semibold"><i className="fas fa-phone-alt" /> {CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold"><i className="fas fa-envelope" /> Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
