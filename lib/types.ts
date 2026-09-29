export type ApplicationForm = {
  firstName: string;
  middleName: string;
  surname: string;
  address: string;
  state: string;
  lga: string;
  gender: "" | "Male" | "Female";
  phone: string;
  email: string;
  course: string;
  hasPreviousSkills: "Yes" | "No";
  previousSkills: string;
};

export const EMPTY_APPLICATION: ApplicationForm = {
  firstName: "", middleName: "", surname: "", address: "", state: "", lga: "",
  gender: "", phone: "", email: "", course: "", hasPreviousSkills: "No", previousSkills: "",
};

/** Snapshot printed on the admission form once the applicant confirms payment. */
export type AdmittedStudent = ApplicationForm & { passport: string; today: string };

export type NotificationType = "info" | "error";

export const APPLICATION_STATUSES = ["pending", "paid", "admitted", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** A row of the `applications` table, as the admin sees it. */
export type ApplicationRow = {
  id: string;
  created_at: string;
  first_name: string;
  middle_name: string;
  surname: string;
  address: string;
  state: string;
  lga: string;
  gender: string;
  phone: string;
  email: string;
  course: string;
  has_previous_skills: string;
  previous_skills: string;
  passport_path: string;
  status: ApplicationStatus;
};

export type MessageRow = { id: string; created_at: string; email: string; message: string; handled: boolean };

export type ActivityComment = { name: string; text: string };
export type ActivityState = { likes: number; liked: boolean; comments: ActivityComment[] };
