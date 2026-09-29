"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LEGACY_VIEWS = ["apply", "activities", "connect"];

/** The old single-page site used `/#apply` style links; send those to the new routes. */
export default function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const view = window.location.hash.replace("#", "");
    if (LEGACY_VIEWS.includes(view)) router.replace(`/${view}`);
  }, [router]);
  return null;
}
