"use client";

/** Rendered in the browser so the copyright year stays current without a rebuild. */
export default function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
