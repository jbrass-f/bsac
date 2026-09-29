"use client";

import { useApp } from "@/components/providers/AppProvider";

export default function NotificationModal() {
  const { notification, closeNotification } = useApp();
  if (!notification.show) return null;
  const isError = notification.type === "error";

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
      <div role="alertdialog" aria-labelledby="notification-title" className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isError ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
          <i className={`fas ${isError ? "fa-exclamation-triangle" : "fa-info-circle"} text-2xl`} />
        </div>
        <h3 id="notification-title" className="text-xl font-bold text-gray-800 mb-2">{notification.title}</h3>
        <p className="text-gray-600 text-sm mb-6">{notification.message}</p>
        <button onClick={closeNotification} className="w-full bg-brand text-white py-3 rounded-full font-semibold hover:bg-brand-dark transition">Dismiss</button>
      </div>
    </div>
  );
}
