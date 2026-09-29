import type { Metadata } from "next";
import ApplyView from "@/components/apply/ApplyView";

export const metadata: Metadata = {
  title: "Apply Now | BSAC Admission Form",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage() {
  return <ApplyView />;
}
