"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "@/lib/admin";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      // AdminApp picks up the new session from the auth listener.
    } catch (err) {
      setError(err instanceof Error && err.message === "Invalid login credentials"
        ? "Incorrect email or password."
        : "Could not sign in. Check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand">BSAC Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to manage applications and messages</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="admin-email" className="text-xs font-bold uppercase text-gray-600">Email</label>
        <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3.5 border border-gray-300 rounded-xl outline-hidden focus:border-brand" />
      </div>
      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-xs font-bold uppercase text-gray-600">Password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3.5 border border-gray-300 rounded-xl outline-hidden focus:border-brand" />
      </div>
      {error && <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
      <button type="submit" disabled={submitting} className="w-full bg-brand text-white py-3.5 rounded-full font-bold hover:bg-brand-dark transition disabled:opacity-60 flex items-center justify-center gap-2">
        {submitting && <i className="fas fa-spinner fa-spin" />}
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
