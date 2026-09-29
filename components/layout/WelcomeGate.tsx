"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { safeSession, useApp } from "@/components/providers/AppProvider";

const SPLASH_MS = 5000;

/** Splash screen on first load, followed by the optional "What is your name?" prompt. */
export default function WelcomeGate() {
  const { setUserName } = useApp();
  const [splash, setSplash] = useState(true);
  const [prompt, setPrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
      let stored: string | null = null;
      let skipped = false;
      let storageOk = false;
      safeSession((s) => {
        stored = s.getItem("bsac_user_name");
        skipped = s.getItem("bsac_name_skipped") === "1";
        storageOk = true;
      });
      if (stored) setUserName(stored);
      else if (!skipped || !storageOk) setPrompt(true);
    }, SPLASH_MS);
    return () => clearTimeout(timer);
  }, [setUserName]);

  const save = () => {
    const name = nameInput.trim().replace(/\s+/g, " ").slice(0, 40);
    if (name) {
      setUserName(name);
      safeSession((s) => s.setItem("bsac_user_name", name));
    }
    setPrompt(false);
    setNameInput("");
  };

  const skip = () => {
    setUserName("");
    setPrompt(false);
    safeSession((s) => {
      s.setItem("bsac_name_skipped", "1");
      s.removeItem("bsac_user_name");
    });
  };

  return (
    <>
      {splash && (
        <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden no-print">
          <div className="relative flex items-center justify-center mb-8">
            <Image src="/welcome.png" alt="Welcome" width={192} height={192} preload className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover shadow-2xl animate-pulse z-10 border-4 border-gold" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand animate-spin [animation-duration:10s]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide text-white animate-text mb-3">
            Welcome to <span className="text-gold">BSAC</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-300 max-w-lg animate-text [animation-delay:0.3s]">
            Empowering Lives • Building Futures • Creating Leaders
          </p>
          <div className="mt-8 w-48 bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand h-full animate-pulse w-full" />
          </div>
        </div>
      )}

      {prompt && (
        <div className="fixed inset-0 z-[99990] bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-text">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center">
              <i className="fas fa-user text-2xl text-brand" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">What is your name?</h3>
            <p className="text-gray-500 text-sm mb-5">Optional — we can personalise a few messages for you during this visit.</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && save()}
              type="text"
              placeholder="Your first name"
              maxLength={40}
              autoFocus
              className="w-full p-3.5 border border-gray-300 rounded-xl outline-hidden focus:border-brand mb-4 text-center"
            />
            <div className="flex flex-col gap-2">
              <button onClick={save} className="w-full bg-brand text-white py-3 rounded-full font-semibold hover:bg-brand-dark transition">Continue</button>
              <button onClick={skip} className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition text-sm">Rather not say</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
