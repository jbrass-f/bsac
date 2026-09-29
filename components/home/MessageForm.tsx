"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "@/components/providers/AppProvider";
import SectionTitle from "@/components/SectionTitle";
import { submitMessage } from "@/lib/supabase";
import { isValidEmail } from "@/lib/validation";

export default function MessageForm() {
  const { userName, notify } = useApp();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 6000);
    return () => clearTimeout(timer);
  }, [success]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSuccess(false);
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    const next = { email: "", message: "" };
    if (!cleanEmail) next.email = "Email is required.";
    else if (!isValidEmail(cleanEmail)) next.email = "Please enter a valid email address.";
    else if (!cleanMessage) next.message = "Message is required.";
    else if (cleanMessage.length < 5) next.message = "Please write a longer message.";
    setErrors(next);
    if (next.email || next.message) return;

    setSubmitting(true);
    try {
      await submitMessage(cleanEmail, cleanMessage);
      setSuccess(true);
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      notify("Send Failed", "Unable to send your message at this time. Please try again or contact us via WhatsApp / email.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const thanks = userName
    ? `Thank you, ${userName}, for your message. Please stay tuned — we will get back to you as soon as possible!`
    : "Thank you for your message. Please stay tuned — we will get back to you as soon as possible!";

  return (
    <section id="send-message" className="px-6 md:px-16 py-20 no-print bg-cream">
      <SectionTitle subtitle="Have a question or enquiry? Send us a message and we will respond as soon as possible.">Send Us a Message</SectionTitle>
      <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="msg-email" className="text-xs font-bold uppercase text-gray-600">Email Address *</label>
            <input
              id="msg-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="your.email@example.com"
              className={`w-full p-3.5 border rounded-xl outline-hidden focus:border-brand transition ${errors.email ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="msg-body" className="text-xs font-bold uppercase text-gray-600">Your Message *</label>
            <textarea
              id="msg-body"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Type your message here…"
              className={`w-full p-3.5 border rounded-xl outline-hidden focus:border-brand transition resize-y min-h-[120px] ${errors.message ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-brand text-white py-3.5 rounded-full font-bold hover:bg-brand-dark transition shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting && <i className="fas fa-spinner fa-spin" />}
            {submitting ? "Sending…" : "Send Message"}
          </button>
          {success && (
            <p className="text-center text-sm text-emerald-600 font-semibold bg-emerald-50 p-3 rounded-xl">
              <i className="fas fa-check-circle mr-1" /> {thanks}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
