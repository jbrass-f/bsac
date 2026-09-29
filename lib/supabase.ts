import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationForm } from "./types";

let client: SupabaseClient | null = null;

export function getSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_* env vars).");
  client = createClient(url, key);
  return client;
}

function dataUrlToBlob(dataUrl: string) {
  const binary = atob(dataUrl.split(",")[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "image/jpeg" });
}

/** Uploads the passport to the private `passports` bucket, then records the application. */
export async function submitApplication(form: ApplicationForm, passportDataUrl: string) {
  const supabase = getSupabase();
  const fileName = `passports/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("passports")
    .upload(fileName, dataUrlToBlob(passportDataUrl), { contentType: "image/jpeg", upsert: false });
  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase.from("applications").insert({
    first_name: form.firstName.trim(),
    middle_name: form.middleName.trim(),
    surname: form.surname.trim(),
    address: form.address.trim(),
    state: form.state.trim(),
    lga: form.lga.trim(),
    gender: form.gender,
    phone: form.phone.trim(),
    email: form.email.trim().toLowerCase(),
    course: form.course,
    has_previous_skills: form.hasPreviousSkills || "No",
    previous_skills: form.previousSkills.trim(),
    passport_path: fileName,
  });
  if (dbError) throw dbError;
}

export async function submitMessage(email: string, message: string) {
  const { error } = await getSupabase().from("messages").insert({ email: email.toLowerCase(), message });
  if (error) throw error;
}
