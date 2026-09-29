"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = { onConfirm: (photo: string) => void; onClose: () => void };

/** Front-camera capture for the passport photograph. Mounted only while open. */
export default function CameraModal({ onConfirm, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreaming(false);
  }, []);

  const startStream = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera API not supported on this device/browser.");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setStreaming(true);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Unable to access camera");
      setStreaming(false);
    }
  }, []);

  useEffect(() => {
    // Deferred so the camera starts after mount rather than synchronously inside the effect.
    const id = setTimeout(startStream, 0);
    return () => {
      clearTimeout(id);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startStream]);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Un-mirror the preview so the saved photo reads correctly.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(canvas.toDataURL("image/jpeg", 0.9));
    stopStream();
  };

  const retake = () => {
    setCaptured(null);
    startStream();
  };

  const close = () => {
    stopStream();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99998] bg-black/90 flex flex-col items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="bg-brand text-white px-5 py-3 flex items-center justify-between">
          <h3 className="font-bold text-sm">Capture Passport Photograph</h3>
          <button onClick={close} aria-label="Close camera" className="text-white/80 hover:text-white"><i className="fas fa-times text-lg" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="relative bg-black rounded-xl overflow-hidden aspect-[3/4] max-h-[55vh] mx-auto flex items-center justify-center">
            <video
              ref={videoRef}
              id="camera-preview"
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!captured && streaming ? "" : "hidden"}`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL from the camera */}
            {captured && <img src={captured} alt="Captured passport" className="w-full h-full object-cover" />}
            {!streaming && !captured && (
              <div className="text-white text-center p-6">
                <i className="fas fa-camera text-4xl mb-3 opacity-50" />
                <p className="text-sm">Starting camera…</p>
              </div>
            )}
          </div>
          <p className="text-xs text-center text-gray-500">Position your face clearly inside the frame. Good lighting helps.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {!captured && (
              <button onClick={takePhoto} disabled={!streaming} className="bg-brand text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-dark transition disabled:opacity-50 flex items-center gap-2">
                <i className="fas fa-camera" /> Capture
              </button>
            )}
            {captured && (
              <>
                <button onClick={retake} className="bg-gray-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition flex items-center gap-2">
                  <i className="fas fa-redo" /> Retake
                </button>
                <button onClick={() => { onConfirm(captured); close(); }} className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-emerald-700 transition flex items-center gap-2">
                  <i className="fas fa-check" /> Use This Photo
                </button>
              </>
            )}
            <button onClick={close} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition">Cancel</button>
          </div>
          {error && <p className="text-xs text-red-600 text-center bg-red-50 p-2 rounded-lg">{error} — You can still upload a photo instead.</p>}
        </div>
      </div>
    </div>
  );
}
