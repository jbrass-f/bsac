import type { Metadata } from "next";
import { PageHeader } from "@/components/SectionTitle";
import ActivityVideos from "@/components/activities/ActivityVideos";
import { SOCIAL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Activities | BSAC",
  alternates: { canonical: "/activities" },
};

const FOLLOW_LINKS = [
  { href: SOCIAL.youtube, label: "YouTube", className: "bg-red-100 text-red-600 hover:bg-red-600", icon: "fa-youtube" },
  { href: SOCIAL.instagram, label: "Instagram", className: "bg-pink-100 text-pink-600 hover:bg-pink-600", icon: "fa-instagram" },
  { href: SOCIAL.facebook, label: "Facebook", className: "bg-blue-100 text-blue-600 hover:bg-blue-600", icon: "fa-facebook-f" },
];

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader title="See Our Activities" subtitle="Watch moments from our training sessions, practical classes and community impact." tag="Activities" />
        <ActivityVideos />

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fab fa-youtube text-3xl" /></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Watch More on YouTube</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">Explore additional training highlights, student projects and centre updates on our official YouTube channel.</p>
          <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg">
            <i className="fab fa-youtube text-lg" /> SEE MORE ACTIVITIES ON YOUTUBE
          </a>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Follow Us</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {FOLLOW_LINKS.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className={`w-12 h-12 rounded-full flex items-center justify-center hover:text-white transition shadow-sm ${link.className}`}>
                  <i className={`fab ${link.icon} text-xl`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
