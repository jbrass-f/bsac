"use client";

import { useEffect, useMemo, useState } from "react";
import { passportUrl, updateApplicationStatus } from "@/lib/admin";
import { APPLICATION_STATUSES, type ApplicationRow, type ApplicationStatus } from "@/lib/types";

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-sky-100 text-sky-800 border-sky-200",
  admitted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fullName = (a: ApplicationRow) => [a.first_name, a.middle_name, a.surname].filter(Boolean).join(" ");

type Props = {
  applications: ApplicationRow[];
  onPatch: (id: string, patch: Partial<ApplicationRow>) => void;
  onError: (message: string) => void;
};

export default function ApplicationsPanel({ applications, onPatch, onError }: Props) {
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [saving, setSaving] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const c = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s, 0])) as Record<ApplicationStatus, number>;
    applications.forEach((a) => { c[a.status] = (c[a.status] ?? 0) + 1; });
    return c;
  }, [applications]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) =>
      (filter === "all" || a.status === filter) &&
      (!q || [fullName(a), a.email, a.phone, a.course].some((v) => v.toLowerCase().includes(q))),
    );
  }, [applications, filter, query]);

  const changeStatus = async (app: ApplicationRow, status: ApplicationStatus) => {
    const previous = app.status;
    onPatch(app.id, { status });
    setSaving((s) => new Set(s).add(app.id));
    try {
      await updateApplicationStatus(app.id, status);
    } catch (err) {
      onPatch(app.id, { status: previous });
      onError(`Could not update ${fullName(app)}: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setSaving((s) => { const n = new Set(s); n.delete(app.id); return n; });
    }
  };

  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {(["all", ...APPLICATION_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`bg-white rounded-2xl p-4 text-left shadow-sm border-2 transition ${filter === s ? "border-brand" : "border-transparent hover:border-gray-200"}`}
          >
            <p className="text-2xl font-bold text-brand">{s === "all" ? applications.length : counts[s]}</p>
            <p className="text-xs font-semibold text-gray-600">{s === "all" ? "All applications" : label(s)}</p>
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, phone or course"
          aria-label="Search applications"
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-hidden focus:border-brand"
        />
      </div>

      {visible.length === 0 ? (
        <p className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          {applications.length === 0 ? "No applications yet." : "No applications match this filter."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((a) => {
            const open = openId === a.id;
            return (
              <li key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button onClick={() => setOpenId(open ? null : a.id)} aria-expanded={open} className="flex-1 min-w-[12rem] text-left flex items-center gap-3">
                    <i className={`fas fa-chevron-${open ? "down" : "right"} text-xs text-gray-400 w-3`} />
                    <span className="min-w-0">
                      <span className="block font-bold text-gray-800 truncate">{fullName(a)}</span>
                      <span className="block text-xs text-gray-500">{a.course} · {formatDate(a.created_at)}</span>
                    </span>
                  </button>
                  <a href={`tel:${a.phone}`} className="text-xs text-gray-600 hover:text-brand hidden md:inline">{a.phone}</a>
                  <div className="flex items-center gap-2">
                    {saving.has(a.id) && <i className="fas fa-spinner fa-spin text-xs text-gray-400" aria-label="Saving" />}
                    <select
                      value={a.status}
                      onChange={(e) => changeStatus(a, e.target.value as ApplicationStatus)}
                      aria-label={`Status for ${fullName(a)}`}
                      className={`text-xs font-bold rounded-full border px-3 py-1.5 outline-hidden ${STATUS_STYLE[a.status]}`}
                    >
                      {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                    </select>
                  </div>
                </div>
                {open && <ApplicationDetail app={a} />}
              </li>
            );
          })}
        </ul>
      )}
      {applications.length >= 1000 && <p className="text-xs text-gray-500 mt-4 text-center">Showing the latest 1000 applications.</p>}
    </section>
  );
}

function ApplicationDetail({ app }: { app: ApplicationRow }) {
  const [photo, setPhoto] = useState<{ path: string; url?: string; error?: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    passportUrl(app.passport_path).then(
      (url) => !cancelled && setPhoto({ path: app.passport_path, url }),
      () => !cancelled && setPhoto({ path: app.passport_path, error: true }),
    );
    return () => { cancelled = true; };
  }, [app.passport_path]);

  const current = photo?.path === app.passport_path ? photo : null;
  const rows: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${app.email}`} className="text-brand hover:underline break-all">{app.email}</a>],
    ["Phone", <span key="p" className="flex flex-wrap gap-3">
      <a href={`tel:${app.phone}`} className="text-brand hover:underline">{app.phone}</a>
      <a href={`https://wa.me/${app.phone.replace(/\D/g, "").replace(/^0/, "234")}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline"><i className="fab fa-whatsapp" /> WhatsApp</a>
    </span>],
    ["Address", app.address],
    ["State / LGA", `${app.state} / ${app.lga}`],
    ["Gender", app.gender],
    ["Course", app.course],
    ["Previous skills", app.has_previous_skills === "Yes" ? `Yes — ${app.previous_skills || "not specified"}` : "No"],
    ["Submitted", formatDate(app.created_at)],
  ];

  return (
    <div className="border-t border-gray-100 bg-gray-50/60 p-4 flex flex-col sm:flex-row gap-5">
      <div className="w-28 h-36 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
        {current?.url ? (
          <a href={current.url} target="_blank" rel="noopener noreferrer" title="Open full size">
            {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL */}
            <img src={current.url} alt={`Passport of ${app.first_name}`} className="w-full h-full object-cover" />
          </a>
        ) : current?.error ? (
          <span className="text-[11px] text-gray-500 text-center p-2">Photo unavailable</span>
        ) : (
          <i className="fas fa-spinner fa-spin text-gray-400" />
        )}
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm flex-1">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] font-bold uppercase text-gray-500">{k}</dt>
            <dd className="text-gray-800">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
