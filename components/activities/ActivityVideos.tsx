"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIVITIES } from "@/lib/content";
import { useApp } from "@/components/providers/AppProvider";

export default function ActivityVideos() {
  const { activities, toggleLike, addComment, notify } = useApp();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [openComments, setOpenComments] = useState<Set<number>>(new Set());
  const [drafts, setDrafts] = useState<string[]>(() => ACTIVITIES.map(() => ""));

  // Pause any video that scrolls mostly out of view.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const video = e.target as HTMLVideoElement;
        if (!e.isIntersecting && !video.paused) video.pause();
      }),
      { threshold: 0.25 },
    );
    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, []);

  // Only one video plays at a time.
  const onPlay = (idx: number) => {
    videoRefs.current.forEach((v, i) => { if (v && i !== idx && !v.paused) v.pause(); });
  };

  const toggleComments = (idx: number) =>
    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });

  const postComment = (idx: number) => {
    const text = drafts[idx].trim();
    if (text.length < 2) return;
    addComment(idx, text);
    setDrafts((d) => d.map((v, i) => (i === idx ? "" : v)));
  };

  const share = async (item: (typeof ACTIVITIES)[number]) => {
    const url = `${window.location.origin}/activities`;
    const copyLink = async () => {
      await navigator.clipboard.writeText(url);
      notify("Link copied", "Activity link copied to clipboard.");
    };
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${item.title} | BSAC`,
          text: `${item.desc} — Watch more activities at Brethren Skills Acquisition Center.`,
          url,
        });
      } else {
        await copyLink();
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      try { await copyLink(); } catch { /* clipboard unavailable */ }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
      {ACTIVITIES.map((item, idx) => {
        const state = activities[idx];
        const showComments = openComments.has(idx);
        return (
          <div key={item.src} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition">
            <div className="aspect-video bg-gray-900 relative">
              <video
                ref={(el) => { videoRefs.current[idx] = el; }}
                src={item.src}
                controls
                preload="metadata"
                playsInline
                onPlay={() => onPlay(idx)}
                className="w-full h-full object-cover aspect-video"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              <div className="video-actions mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => toggleLike(idx)}
                  aria-pressed={state.liked}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold hover:bg-cream transition ${state.liked ? "text-brand" : "text-gray-600"}`}
                >
                  <i className={state.liked ? "fas fa-heart" : "far fa-heart"} />
                  <span>{state.likes}</span>
                </button>
                <button type="button" onClick={() => toggleComments(idx)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-cream transition">
                  <i className="far fa-comment" />
                  <span>{state.comments.length}</span>
                </button>
                <button type="button" onClick={() => share(item)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-cream transition ml-auto">
                  <i className="fas fa-share-alt" />
                  <span>Share</span>
                </button>
              </div>
              {showComments && (
                <div className="mt-3 space-y-2">
                  {state.comments.length > 0 && (
                    <div className="max-h-28 overflow-y-auto space-y-1.5 mb-2">
                      {state.comments.map((c, ci) => (
                        <div key={ci} className="bg-cream rounded-lg px-3 py-1.5 text-xs text-gray-700">
                          <span className="font-semibold text-brand">{c.name}:</span> {c.text}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={drafts[idx]}
                      onChange={(e) => setDrafts((d) => d.map((v, i) => (i === idx ? e.target.value : v)))}
                      onKeyUp={(e) => e.key === "Enter" && postComment(idx)}
                      type="text"
                      placeholder="Write a comment…"
                      maxLength={200}
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-xs outline-hidden focus:border-brand"
                    />
                    <button type="button" onClick={() => postComment(idx)} className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-dark transition">Post</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
