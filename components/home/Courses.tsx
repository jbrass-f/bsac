"use client";

import { useRouter } from "next/navigation";
import { COURSES } from "@/lib/content";
import { useApp } from "@/components/providers/AppProvider";
import SectionTitle from "@/components/SectionTitle";

export default function Courses() {
  const router = useRouter();
  const { notify, setForm } = useApp();

  const choose = (title: string, available: boolean) => {
    if (!available) {
      notify("Coming Soon", "This skill is still under development.");
      return;
    }
    setForm((f) => ({ ...f, course: title }));
    router.push("/apply");
  };

  return (
    <section id="courses" className="px-6 md:px-16 py-24 no-print">
      <SectionTitle>Our Courses</SectionTitle>
      <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
        {COURSES.map((course) => (
          <button
            key={course.title}
            type="button"
            onClick={() => choose(course.title, course.available)}
            className="bg-white p-5 md:p-8 rounded-2xl text-center shadow-lg hover:-translate-y-2 transition border border-transparent hover:border-brand group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-4 bg-cream rounded-full flex items-center justify-center group-hover:bg-brand transition">
                <i className={`fas ${course.icon} text-xl md:text-3xl text-brand group-hover:text-white transition`} />
              </div>
              <h3 className="font-bold text-base md:text-xl mb-2 text-gray-800">{course.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed hidden sm:block">{course.desc}</p>
            </div>
            <span className={`inline-block mt-4 text-xs font-semibold ${course.available ? "text-brand group-hover:underline" : "text-amber-600 font-bold"}`}>
              {course.available ? "Choose Skill →" : "Coming Soon"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
