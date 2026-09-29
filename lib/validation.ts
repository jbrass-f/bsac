export function isValidEmail(email: string) {
  if (!email) return false;
  const trimmed = email.trim();
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(trimmed) && trimmed.length <= 254 && !trimmed.startsWith(".") && !trimmed.includes("..");
}

export function isValidNigerianPhone(phone: string) {
  if (!phone) return false;
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+234")) cleaned = "0" + cleaned.slice(4);
  else if (cleaned.startsWith("234")) cleaned = "0" + cleaned.slice(3);
  return /^0[789][01]\d{8}$/.test(cleaned);
}
