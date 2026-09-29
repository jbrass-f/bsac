import Hero from "@/components/home/Hero";
import Courses from "@/components/home/Courses";
import Gallery from "@/components/home/Gallery";
import Certificate from "@/components/home/Certificate";
import Faq from "@/components/home/Faq";
import MessageForm from "@/components/home/MessageForm";
import LegacyHashRedirect from "@/components/home/LegacyHashRedirect";
import { About, Contact, Footer, Stats } from "@/components/home/StaticSections";

export default function HomePage() {
  return (
    <>
      <LegacyHashRedirect />
      <Hero />
      <Stats />
      <About />
      <Courses />
      <Gallery />
      <Certificate />
      <Faq />
      <Contact />
      <MessageForm />
      <Footer />
    </>
  );
}
