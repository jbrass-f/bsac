"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { fetchApplications, fetchMessages, signOut } from "@/lib/admin";
import type { ApplicationRow, MessageRow } from "@/lib/types";
import ApplicationsPanel from "./ApplicationsPanel";
import MessagesPanel from "./MessagesPanel";

type Tab = "applications" | "messages";
type Data = { applications: ApplicationRow[]; messages: MessageRow[] };

export default function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("applications");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [applications, messages] = await Promise.all([fetchApplications(), fetchMessages()]);
      setData({ applications, messages });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load data.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchApplications(), fetchMessages()]).then(
      ([applications, messages]) => !cancelled && setData({ applications, messages }),
      (err: Error) => !cancelled && setError(err.message),
    );
    return () => { cancelled = true; };
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const pending = data?.applications.filter((a) => a.status === "pending").length ?? 0;
  const unhandled = data?.messages.filter((m) => !m.handled).length ?? 0;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-brand text-cream shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Image src="/logo.png" alt="BSAC Logo" width={36} height={36} className="h-9 w-9 rounded-full object-cover border border-white/20" />
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-tight">BSAC Admin</p>
            <p className="text-[11px] text-cream/70 truncate">{email}</p>
          </div>
          <button onClick={refresh} disabled={refreshing} className="text-xs font-semibold px-3 py-2 rounded-full hover:bg-white/10 transition flex items-center gap-1.5" aria-label="Refresh">
            <i className={`fas fa-sync-alt ${refreshing ? "fa-spin" : ""}`} /> <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={signOut} aria-label="Sign out" className="text-xs font-semibold px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5">
            <i className="fas fa-sign-out-alt" /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-4 flex gap-1" role="tablist">
          {([["applications", "Applications", pending], ["messages", "Messages", unhandled]] as const).map(([key, label, badge]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${tab === key ? "border-gold text-white" : "border-transparent text-cream/70 hover:text-white"}`}
            >
              {label}
              {badge > 0 && <span className="bg-gold text-ink text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-5 text-center">{badge}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2">
            <i className="fas fa-exclamation-triangle mt-0.5" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError("")} aria-label="Dismiss error" className="text-red-400 hover:text-red-700"><i className="fas fa-times" /></button>
          </div>
        )}
        {!data ? (
          !error && <div className="py-20 text-center"><i className="fas fa-spinner fa-spin text-3xl text-brand" /></div>
        ) : tab === "applications" ? (
          <ApplicationsPanel
            applications={data.applications}
            onPatch={(id, patch) => setData((d) => d && { ...d, applications: d.applications.map((a) => (a.id === id ? { ...a, ...patch } : a)) })}
            onRemove={(id) => setData((d) => d && { ...d, applications: d.applications.filter((a) => a.id !== id) })}
            onError={setError}
          />
        ) : (
          <MessagesPanel
            messages={data.messages}
            onPatch={(id, patch) => setData((d) => d && { ...d, messages: d.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) })}
            onError={setError}
          />
        )}
      </main>
    </div>
  );
}