import { getSupabase } from "./supabase";
import type { ApplicationRow, ApplicationStatus, MessageRow } from "./types";

// Every call here runs as the signed-in user; Row Level Security (supabase/admin.sql) only lets
// the one account listed in `public.admins` read or change anything.

export async function signIn(email: string, password: string) {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await getSupabase().auth.signOut();
}

export async function isAdmin() {
  const { data, error } = await getSupabase().rpc("is_admin");
  if (error) throw error;
  return data === true;
}

export async function fetchApplications() {
  const { data, error } = await getSupabase()
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return data as ApplicationRow[];
}

// Row Level Security makes a disallowed update silently match zero rows, so check that one changed.
function assertUpdated(data: unknown[] | null) {
  if (!data?.length) throw new Error("The change was not saved (not permitted or record no longer exists).");
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const { data, error } = await getSupabase().from("applications").update({ status }).eq("id", id).select("id");
  if (error) throw error;
  assertUpdated(data);
}

export async function fetchMessages() {
  const { data, error } = await getSupabase()
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return data as MessageRow[];
}

export async function setMessageHandled(id: string, handled: boolean) {
  const { data, error } = await getSupabase().from("messages").update({ handled }).eq("id", id).select("id");
  if (error) throw error;
  assertUpdated(data);
}

/** Short-lived link to a private passport photo. */
export async function passportUrl(path: string) {
  const { data, error } = await getSupabase().storage.from("passports").createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}
