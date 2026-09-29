"use client";

import { useMemo, useState } from "react";
import { setMessageHandled } from "@/lib/admin";
import type { MessageRow } from "@/lib/types";
import { formatDate } from "./ApplicationsPanel";

type Props = {
  messages: MessageRow[];
  onPatch: (id: string, patch: Partial<MessageRow>) => void;
  onError: (message: string) => void;
};

export default function MessagesPanel({ messages, onPatch, onError }: Props) {
  const [showHandled, setShowHandled] = useState(false);
  const visible = useMemo(() => (showHandled ? messages : messages.filter((m) => !m.handled)), [messages, showHandled]);

  const toggle = async (m: MessageRow) => {
    onPatch(m.id, { handled: !m.handled });
    try {
      await setMessageHandled(m.id, !m.handled);
    } catch (err) {
      onPatch(m.id, { handled: m.handled });
      onError(`Could not update message: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          {messages.filter((m) => !m.handled).length} unhandled · {messages.length} total
        </p>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} className="accent-brand" />
          Show handled
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          {messages.length === 0 ? "No messages yet." : "All messages have been handled."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((m) => (
            <li key={m.id} className={`bg-white rounded-2xl shadow-sm border p-4 ${m.handled ? "border-gray-100 opacity-70" : "border-gold/40"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to BSAC")}`} className="font-semibold text-brand hover:underline break-all">
                  {m.email}
                </a>
                <span className="text-xs text-gray-500">{formatDate(m.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{m.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to BSAC")}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cream text-brand hover:bg-gold/30 transition"
                >
                  <i className="fas fa-reply mr-1" /> Reply by email
                </a>
                <button
                  onClick={() => toggle(m)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${m.handled ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                >
                  <i className={`fas ${m.handled ? "fa-undo" : "fa-check"} mr-1`} /> {m.handled ? "Mark unhandled" : "Mark handled"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
