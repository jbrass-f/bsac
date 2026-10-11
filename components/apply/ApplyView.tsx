"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/SectionTitle";
import { COURSES, isCourseAvailable } from "@/lib/content";
import { submitApplication } from "@/lib/supabase";
import type { ApplicationForm } from "@/lib/types";
import { isValidEmail, isValidNigerianPhone } from "@/lib/validation";
import CameraModal from "./CameraModal";
import PaymentModal from "./PaymentModal";
import AdmissionPreview, { FAITH_NOTE } from "./AdmissionPreview";

const inputClass = "w-full p-3 sm:p-3.5 border border-gray-300 rounded-xl outline-hidden focus:border-brand";
const labelClass = "text-xs font-bold uppercase text-gray-600";
const MAX_PASSPORT_BYTES = 8 * 1024 * 1024;

// The form is shown one short step at a time so each step fits on a phone screen, and the
// Back / Next / Submit buttons stay pinned in view (just above the bottom navigation).
const STEPS = ["Photo", "You", "Contact", "Course"] as const;
const LAST_STEP = STEPS.length - 1;
const STEP_TITLES = ["Passport photo", "About you", "Address & contact", "Your course"];

export default function ApplyView() {
  const { form, setForm, passportImage, setPassportImage, student, setStudent, resetApplication, notify } = useApp();
  const fileInput = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Bring the new step to the top of the visible screen so nobody has to scroll to find it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      // On a phone, start with the form itself filling the screen (the page title is just above).
      if (window.matchMedia("(max-width: 639px)").matches) cardRef.current?.scrollIntoView({ block: "start" });
      return;
    }
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const update = <K extends keyof ApplicationForm>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const course = e.target.value;
    if (course && !isCourseAvailable(course)) {
      notify("Coming Soon", "This skill is still under development.");
      setForm((f) => ({ ...f, course: "" }));
      return;
    }
    setForm((f) => ({ ...f, course }));
  };

  const onPassportSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Invalid File", "Please select a valid image (JPG, PNG or WEBP).", "error");
      return;
    }
    if (file.size > MAX_PASSPORT_BYTES) {
      notify("File Too Large", "Please choose an image smaller than 8 MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPassportImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  /** Checks only the fields on the current step; returns true when it is OK to move on. */
  const stepIsValid = () => {
    setErrors({ email: "", phone: "" });
    if (step === 0) {
      if (!passportImage) {
        notify("Passport Required", "Please upload or capture a passport photo to proceed.", "error");
        return false;
      }
      return true;
    }
    if (!formRef.current?.reportValidity()) return false;
    if (step === 2) {
      if (!isValidEmail(form.email)) {
        setErrors({ email: "Please enter a valid email address (e.g. name@example.com).", phone: "" });
        return false;
      }
      if (!isValidNigerianPhone(form.phone)) {
        setErrors({ email: "", phone: "Please enter a valid Nigerian phone number (e.g. 08032447550 or +2348032447550)." });
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (stepIsValid()) setStep((n) => Math.min(n + 1, LAST_STEP));
  };

  const goBack = () => {
    setErrors({ email: "", phone: "" });
    setStep((n) => Math.max(n - 1, 0));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    // Pressing Enter on an earlier step just moves to the next step.
    if (step < LAST_STEP) { goNext(); return; }
    setErrors({ email: "", phone: "" });

    if (!passportImage) {
      setStep(0);
      notify("Passport Required", "Please upload or capture a passport photo to proceed.", "error");
      return;
    }
    const required = [form.firstName, form.surname, form.address, form.state, form.lga, form.gender, form.phone, form.email, form.course];
    if (required.some((v) => !v.trim())) {
      // Take the applicant to the first step that still has something missing.
      const stepOf = [1, 1, 2, 2, 2, 1, 2, 2, 3];
      setStep(Math.min(...required.map((v, i) => (v.trim() ? LAST_STEP : stepOf[i]))));
      notify("Missing Information", "Please complete all required fields.", "error");
      return;
    }
    if (!isValidEmail(form.email)) {
      setStep(2);
      setErrors({ email: "Please enter a valid email address (e.g. name@example.com).", phone: "" });
      return;
    }
    if (!isValidNigerianPhone(form.phone)) {
      setStep(2);
      setErrors({ email: "", phone: "Please enter a valid Nigerian phone number (e.g. 08032447550 or +2348032447550)." });
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication(form, passportImage);
      setPaymentOpen(true);
    } catch (err) {
      console.error(err);
      notify("Submission Failed", "Unable to save your application. Please check your connection and try again, or contact us on WhatsApp.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    resetApplication();
    setStep(0);
  };

  const confirmAndGenerate = () => {
    if (!passportImage) return;
    setPaymentOpen(false);
    setStudent({ ...form, passport: passportImage, today: new Date().toLocaleDateString("en-GB") });
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader title="Admission Application" subtitle="Complete the form below to apply for a skills programme at BSAC" tag="Application" />

        {student ? (
          <AdmissionPreview student={student} onRestart={restart} />
        ) : (
          <div ref={cardRef} className="scroll-mt-24">
            <form ref={formRef} onSubmit={onSubmit} className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl shadow-xl space-y-4 sm:space-y-5">
              {step === 0 ? (
                <div className="hidden sm:block text-center border-b pb-4">
                  <Image src="/logo.png" alt="BSAC Logo" width={64} height={64} className="h-14 w-14 mx-auto mb-2 rounded-full object-cover shadow-sm" />
                  <h3 className="font-bold text-base sm:text-xl text-brand">EYN CHURCH OF THE BRETHREN IN NIGERIA LCC UTAKO</h3>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800">BRETHREN SKILLS ACQUISITION CENTER</h4>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Admission Application Form</p>
                </div>
              ) : null}

              <div aria-label={`Step ${step + 1} of ${STEPS.length}`}>
                <div className="flex gap-1.5" aria-hidden="true">
                  {STEPS.map((name, i) => (
                    <span key={name} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-brand" : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Step {step + 1} of {STEPS.length} · <span className="text-brand">{STEP_TITLES[step]}</span>
                </p>
              </div>

              {step === 0 && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-32 h-40 sm:w-36 sm:h-44 border-2 border-dashed border-brand rounded-xl flex flex-col items-center justify-center text-center p-2 relative overflow-hidden bg-gray-50">
                    {passportImage ? (
                      // eslint-disable-next-line @next/next/no-img-element -- data URL preview
                      <img src={passportImage} alt="Passport preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center px-2">
                        <i className="fas fa-id-card text-3xl text-brand mb-2" />
                        <span className="text-xs font-medium text-gray-600">Passport Photograph *</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button type="button" onClick={() => fileInput.current?.click()} className="bg-brand text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-brand-dark transition flex items-center gap-2">
                      <i className="fas fa-upload" /> Upload Photo
                    </button>
                    <button type="button" onClick={() => setCameraOpen(true)} className="bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-2">
                      <i className="fas fa-camera" /> Take Photo
                    </button>
                    {passportImage && (
                      <button type="button" onClick={() => setPassportImage(null)} className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-200 transition flex items-center gap-2">
                        <i className="fas fa-trash-alt" /> Remove
                      </button>
                    )}
                  </div>
                  <input type="file" ref={fileInput} accept="image/jpeg,image/png,image/webp,image/*" className="hidden" onChange={onPassportSelected} />
                  <p className="text-[11px] text-gray-500 text-center max-w-xs">JPG, PNG or WEBP. Clear front-facing photo recommended.</p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className={labelClass}>Full Name *</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input value={form.firstName} onChange={update("firstName")} type="text" placeholder="First Name *" aria-label="First name" required className={inputClass} />
                      <input value={form.middleName} onChange={update("middleName")} type="text" placeholder="Middle Name (optional)" aria-label="Middle name" className={inputClass} />
                      <input value={form.surname} onChange={update("surname")} type="text" placeholder="Surname *" aria-label="Surname" required className={inputClass} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gender" className={labelClass}>Gender *</label>
                    <select id="gender" value={form.gender} onChange={update("gender")} required className={inputClass}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="address" className={labelClass}>Street Address *</label>
                    <input id="address" value={form.address} onChange={update("address")} type="text" placeholder="Street Address *" required className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label htmlFor="state" className={labelClass}>State *</label>
                      <input id="state" value={form.state} onChange={update("state")} type="text" placeholder="State *" required className={inputClass} />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label htmlFor="lga" className={labelClass}>LGA *</label>
                      <input id="lga" value={form.lga} onChange={update("lga")} type="text" placeholder="LGA *" required className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                      <input id="phone" value={form.phone} onChange={update("phone")} type="tel" placeholder="08032447550 *" required className={`${inputClass} ${errors.phone ? "border-red-400" : ""}`} />
                      {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label htmlFor="email" className={labelClass}>Email Address *</label>
                      <input id="email" value={form.email} onChange={update("email")} type="email" placeholder="bsacutako@gmail.com *" required className={`${inputClass} ${errors.email ? "border-red-400" : ""}`} />
                      {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="course" className={labelClass}>Skills Applied For *</label>
                    <select id="course" value={form.course} onChange={onCourseChange} required className={inputClass}>
                      <option value="">Select Course</option>
                      {COURSES.map((c) => (
                        <option key={c.title} value={c.title} disabled={!c.available}>
                          {c.available ? c.title : `${c.title} (Coming Soon)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span className={labelClass}>Any Previous Skills Acquired?</span>
                    <div className="flex items-center gap-6 mb-2">
                      {(["Yes", "No"] as const).map((v) => (
                        <label key={v} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="hasPreviousSkills" value={v} checked={form.hasPreviousSkills === v} onChange={update("hasPreviousSkills")} className="accent-brand" /> {v}
                        </label>
                      ))}
                    </div>
                    {form.hasPreviousSkills === "Yes" && (
                      <input value={form.previousSkills} onChange={update("previousSkills")} type="text" placeholder="If yes, which skills?" aria-label="Previous skills" className={inputClass} />
                    )}
                  </div>

                  <p className="text-xs italic text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200"><strong>Note:</strong> {FAITH_NOTE}</p>
                </div>
              )}

              {/* Pinned just above the bottom navigation, so the buttons are always on screen. */}
              <div className="sticky bottom-20 z-20 -mx-1 flex gap-3 rounded-2xl bg-white/95 px-1 pt-3 pb-1 backdrop-blur border-t border-gray-100">
                {step > 0 && (
                  <button type="button" onClick={goBack} disabled={submitting} className="flex-none bg-gray-100 text-gray-700 px-5 py-3.5 rounded-full font-bold text-sm hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:opacity-60">
                    <i className="fas fa-arrow-left" /> Back
                  </button>
                )}
                {step < LAST_STEP ? (
                  <button type="button" onClick={goNext} className="flex-1 bg-brand text-white py-3.5 rounded-full font-bold text-base hover:bg-brand-dark transition shadow-lg flex items-center justify-center gap-2">
                    Next <i className="fas fa-arrow-right" />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="flex-1 bg-brand text-white py-3.5 rounded-full font-bold text-sm sm:text-base hover:bg-brand-dark transition shadow-lg disabled:opacity-60">
                    {submitting ? "Processing…" : <>Submit &amp; Generate<span className="hidden sm:inline"> Form</span></>}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {cameraOpen && <CameraModal onConfirm={setPassportImage} onClose={() => setCameraOpen(false)} />}
      {paymentOpen && <PaymentModal form={form} onPrint={confirmAndGenerate} onBack={() => setPaymentOpen(false)} />}
    </div>
  );
}