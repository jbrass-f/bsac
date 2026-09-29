import Image from "next/image";
import Link from "next/link";
import { CONTACT, NAV_ITEMS, SOCIAL, STATS } from "@/lib/content";
import SectionTitle from "@/components/SectionTitle";
import CurrentYear from "@/components/home/CurrentYear";

export function Stats() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-5 px-6 md:px-16 py-14 no-print">
      {STATS.map((stat) => (
        <div key={stat.label} className="bg-white text-center p-7 rounded-2xl shadow-lg hover:-translate-y-2 transition">
          <h2 className="text-brand text-4xl font-bold">{stat.count}</h2>
          <p className="mt-2 text-gray-700 font-medium">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="px-6 md:px-16 py-24 no-print">
      <SectionTitle>About BSAC</SectionTitle>
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        <div className="space-y-4 leading-relaxed text-gray-700">
          <p className="text-lg">
            Brethren Skills Acquisition Center (BSAC) is an initiative of Church of the Brethren in Nigeria (EYN) LCC Utako, Abuja, dedicated to empowering individuals through comprehensive skills acquisition.
          </p>
          <p>We equip students with high-demand practical skills including Fashion Design, Bakery, Coding, Adult Education, and Graphic Design that create sustainable opportunities for self reliance.</p>
          <p>Our commitment is to raise highly skilled professionals capable of excelling and competing globally in their respective industries.</p>
        </div>
        <div className="flex justify-center">
          <Image src="/about.png" alt="About BSAC" width={448} height={448} className="w-full max-w-md h-auto rounded-2xl p-4 bg-white shadow-lg object-contain" />
        </div>
      </div>
    </section>
  );
}

const CONTACT_LINKS = [
  { href: `https://wa.me/${CONTACT.whatsapp}`, icon: "fab fa-whatsapp text-emerald-500", label: "WhatsApp", external: true },
  { href: SOCIAL.telegram, icon: "fab fa-telegram text-sky-500", label: "Telegram", external: true },
  { href: SOCIAL.facebook, icon: "fab fa-facebook-messenger text-blue-600", label: "Facebook DM", external: true },
  { href: SOCIAL.instagram, icon: "fab fa-instagram text-pink-600", label: "Instagram DM", external: true },
  { href: `tel:${CONTACT.phone}`, icon: "fas fa-phone-alt text-brand", label: "Call Us", external: false },
  { href: `mailto:${CONTACT.email}`, icon: "fas fa-envelope text-amber-600", label: "Email", external: false },
];

export function Contact() {
  return (
    <section id="contact" className="px-6 md:px-16 py-24 no-print bg-white/50">
      <SectionTitle>Contact Us</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center hover:shadow-2xl transition"
          >
            <i className={`${link.icon} text-4xl animated-icon mb-2`} />
            <span className="text-xs font-bold text-gray-700">{link.label}</span>
          </a>
        ))}
      </div>
      <div className="mt-10 max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0">
          <i className="fas fa-map-marker-alt text-brand text-xl" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">Our Location</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{CONTACT.address}</p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand text-cream pt-14 pb-28 no-print">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="BSAC Logo" width={48} height={48} className="h-12 w-12 rounded-full object-cover border border-white/20" />
              <div>
                <h3 className="font-bold text-lg leading-tight">BSAC</h3>
                <p className="text-xs text-gold">Brethren Skills Acquisition Center</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">Empowering lives through practical skills at EYN Church LCC Utako, Abuja.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}><Link href={item.href} className="hover:text-white transition">{item.label}</Link></li>
              ))}
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2"><i className="fas fa-phone-alt text-gold" /> {CONTACT.phone}</li>
              <li className="flex items-center gap-2"><i className="fas fa-envelope text-gold" /> {CONTACT.email}</li>
              <li className="flex items-start gap-2"><i className="fas fa-map-marker-alt text-gold mt-1" /> EYN Church Utako, Abuja</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© <CurrentYear /> Brethren Skills Acquisition Center (BSAC). All rights reserved.</p>
          <p>
            Designed and Developed by{" "}
            <a href="https://wa.me/2349025552740" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">Jonathan David</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
