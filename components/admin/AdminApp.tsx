"use client";

import type { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isAdmin, signOut } from "@/lib/admin";
import { getSupabase } from "@/lib/supabase";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

type AdminCheck = { userId: string; ok: boolean; error?: string };

export default function AdminApp() {
  // undefined = still restoring the saved session
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [check, setCheck] = useState<AdminCheck | null>(null);

  useEffect(() => {
    // Fires INITIAL_SESSION immediately, then on every sign-in / sign-out / token refresh.
    const { data } = getSupabase().auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    isAdmin().then(
      (ok) => !cancelled && setCheck({ userId, ok }),
      (err: Error) => !cancelled && setCheck({ userId, ok: false, error: err.message }),
    );
    return () => { cancelled = true; };
  }, [userId]);

  if (session === undefined || (session && check?.userId !== session.user.id)) {
    return <Centered><i className="fas fa-spinner fa-spin text-3xl text-brand" /></Centered>;
  }

  if (!session) {
    return <Centered><LoginForm /></Centered>;
  }

  if (!check?.ok) {
    return (
      <Centered>
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><i className="fas fa-lock text-2xl" /></div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">No admin access</h1>
          <p className="text-sm text-gray-600 mb-6">
            {check?.error ? `Could not verify access: ${check.error}` : `${session.user.email} is signed in but is not the BSAC admin.`}
          </p>
          <button onClick={signOut} className="w-full bg-brand text-white py-3 rounded-full font-semibold hover:bg-brand-dark transition">Sign out</button>
        </div>
      </Centered>
    );
  }

  return <Dashboard email={session.user.email ?? ""} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <Image src="/logo.png" alt="BSAC Logo" width={64} height={64} preload className="h-16 w-16 rounded-full object-cover shadow-sm" />
      {children}
    </main>
  );
}
