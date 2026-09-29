"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { ACTIVITIES } from "@/lib/content";
import { EMPTY_APPLICATION, type ActivityState, type AdmittedStudent, type ApplicationForm, type NotificationType } from "@/lib/types";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Notification = { show: boolean; title: string; message: string; type: NotificationType };

type AppContextValue = {
  userName: string;
  setUserName: (name: string) => void;

  notification: Notification;
  notify: (title: string, message: string, type?: NotificationType) => void;
  closeNotification: () => void;

  canInstall: boolean;
  isInstalled: boolean;
  showInstallBanner: boolean;
  installApp: () => Promise<void>;
  dismissInstallBanner: () => void;

  // Application state lives here so a half-filled form survives navigating between pages.
  form: ApplicationForm;
  setForm: React.Dispatch<React.SetStateAction<ApplicationForm>>;
  passportImage: string | null;
  setPassportImage: (img: string | null) => void;
  student: AdmittedStudent | null;
  setStudent: (s: AdmittedStudent | null) => void;
  resetApplication: () => void;

  activities: ActivityState[];
  toggleLike: (idx: number) => void;
  addComment: (idx: number, text: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function safeSession(action: (s: Storage) => void) {
  try { action(window.sessionStorage); } catch { /* storage blocked (private mode etc.) */ }
}

function subscribeStandalone(onChange: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function getStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState("");
  const [notification, setNotification] = useState<Notification>({ show: false, title: "", message: "", type: "info" });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installAccepted, setInstallAccepted] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const standalone = useSyncExternalStore(subscribeStandalone, getStandalone, () => false);
  const isInstalled = standalone || installAccepted;

  const [form, setForm] = useState<ApplicationForm>(EMPTY_APPLICATION);
  const [passportImage, setPassportImage] = useState<string | null>(null);
  const [student, setStudent] = useState<AdmittedStudent | null>(null);

  const [activities, setActivities] = useState<ActivityState[]>(() => ACTIVITIES.map(() => ({ likes: 0, liked: false, comments: [] })));

  const notify = useCallback((title: string, message: string, type: NotificationType = "info") => {
    setNotification({ show: true, title, message, type });
  }, []);
  const closeNotification = useCallback(() => setNotification((n) => ({ ...n, show: false })), []);

  useEffect(() => {
    let bannerTimer: ReturnType<typeof setTimeout> | undefined;
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      let dismissed = false;
      safeSession((s) => { dismissed = s.getItem("bsac_install_dismissed") === "1"; });
      if (!dismissed) bannerTimer = setTimeout(() => setShowInstallBanner(true), 8000);
    };
    const onInstalled = () => {
      setInstallAccepted(true);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      clearTimeout(bannerTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      notify("Install unavailable", "Your browser does not support installing this app right now.");
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallAccepted(true);
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt, notify]);

  const dismissInstallBanner = useCallback(() => {
    setShowInstallBanner(false);
    safeSession((s) => s.setItem("bsac_install_dismissed", "1"));
  }, []);

  const resetApplication = useCallback(() => {
    setForm(EMPTY_APPLICATION);
    setPassportImage(null);
    setStudent(null);
  }, []);

  const toggleLike = useCallback((idx: number) => {
    const wasLiked = activities[idx]?.liked;
    setActivities((list) => list.map((a, i) =>
      i !== idx ? a : a.liked ? { ...a, liked: false, likes: Math.max(0, a.likes - 1) } : { ...a, liked: true, likes: a.likes + 1 }
    ));
    if (!wasLiked) notify("Liked", userName ? `Thank you, ${userName}, for liking this video!` : "Thank you for liking this video!");
  }, [activities, notify, userName]);

  const addComment = useCallback((idx: number, text: string) => {
    setActivities((list) => list.map((a, i) => (i === idx ? { ...a, comments: [...a.comments, { name: userName || "Guest", text }] } : a)));
    notify("Comment posted", userName ? `Thank you, ${userName}, for your comment!` : "Thank you for your comment!");
  }, [notify, userName]);

  const value = useMemo<AppContextValue>(() => ({
    userName, setUserName,
    notification, notify, closeNotification,
    canInstall: Boolean(deferredPrompt) && !isInstalled,
    isInstalled,
    showInstallBanner: showInstallBanner && Boolean(deferredPrompt) && !isInstalled,
    installApp, dismissInstallBanner,
    form, setForm, passportImage, setPassportImage, student, setStudent, resetApplication,
    activities, toggleLike, addComment,
  }), [userName, notification, notify, closeNotification, deferredPrompt, isInstalled, showInstallBanner, installApp,
    dismissInstallBanner, form, passportImage, student, resetApplication, activities, toggleLike, addComment]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
