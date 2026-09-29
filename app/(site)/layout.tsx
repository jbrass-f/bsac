import { AppProvider } from "@/components/providers/AppProvider";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WelcomeGate from "@/components/layout/WelcomeGate";
import InstallBanner from "@/components/layout/InstallBanner";
import NotificationModal from "@/components/layout/NotificationModal";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";

/** Chrome for the public site (the admin area at /admin has its own). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="pt-20">
        <Header />
        <WelcomeGate />
        <InstallBanner />
        <NotificationModal />
        {children}
        <BottomNav />
        <ServiceWorkerRegister />
      </div>
    </AppProvider>
  );
}
