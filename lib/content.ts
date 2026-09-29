export const SITE_URL = "https://bsac-center.web.app";

export const CONTACT = {
  phone: "08032447550",
  whatsapp: "2348032447550",
  email: "bsacutako@gmail.com",
  address: "No.1 Teslim O. Elias Street, Near Old CBN Quarters, EYN Church Utako, Abuja, FCT, Nigeria",
};

export const SOCIAL = {
  facebook: "https://www.facebook.com/profile.php?id=61593087375331",
  instagram: "https://www.instagram.com/brethrenskillaquisition",
  youtube: "https://www.youtube.com/@Brethrenskillsacquisitioncente",
  telegram: `https://t.me/+${CONTACT.whatsapp}`,
};

export const PAYMENT = {
  fee: "₦40,000",
  accountNumber: "1012248796",
  accountName: "EYN CHURCH OF THE BRETHEREN IN NIGERIA(MCS ACCOUNT)",
  bank: "ZENITH BANK",
};

export const MOTTO = "Get skill, work and live (Exodus 35:35)";

export const HEADER_TEXTS = [
  "BRETHREN SKILLS ACQUISITION CENTER",
  "EMPOWERING LIVES THROUGH PRACTICAL SKILL ACQUISITION",
  "EYN CHURCH LCC UTAKO ABUJA",
  "GET SKILL, WORK AND LIVE (EXODUS 35:35)",
];

export const BACKGROUND_SLIDES = ["/bg1.png", "/bg2.png", "/bg3.png"];

export type Course = { title: string; icon: string; desc: string; available: boolean };

export const COURSES: Course[] = [
  { title: "Fashion Design", icon: "fa-cut", desc: "Comprehensive tailoring, pattern drafting, and garment construction.", available: true },
  { title: "Bakery", icon: "fa-bread-slice", desc: "Practical baking techniques for bread, cakes, pastries, and confectioneries.", available: true },
  { title: "Coding", icon: "fa-code", desc: "Modern web development, programming concepts, and practical software design.", available: false },
  { title: "Adult Education", icon: "fa-book-reader", desc: "Functional literacy, numeracy, and personal development classes.", available: false },
  { title: "Graphic Design", icon: "fa-palette", desc: "Visual branding, digital content creation, and graphic layout techniques.", available: false },
];

export function isCourseAvailable(title: string) {
  return COURSES.some((c) => c.title === title && c.available);
}

export const STATS = [
  { label: "Trained Graduates", count: "100+" },
  { label: "Active Courses", count: String(COURSES.filter((c) => c.available).length) },
  { label: "Expert Instructors", count: "5+" },
  { label: "Practical Training", count: "100%" },
];

export type GalleryImage = { src: string; title: string };

export const GALLERY: GalleryImage[] = [
  { src: "/gallery1.png", title: "Fashion Workshop Practical" },
  { src: "/gallery2.png", title: "Baking Practical Class" },
  { src: "/gallery3.png", title: "Computer Training Session" },
  { src: "/gallery4.png", title: "Adult Education Literacy" },
];

export const FAQS = [
  { q: "Who can apply for BSAC training programs?", a: "BSAC programs are open to anyone looking to acquire practical skills for self-reliance and career empowerment." },
  { q: "Where is BSAC located?", a: "BSAC is located at EYN Church Utako, No.1 Teslim O. Elias Street, Near Old CBN Quarters, Utako, Abuja." },
  { q: "Will I receive a certificate after training?", a: "Yes, students who successfully complete their coursework and practical assessments will receive an official certification." },
];

export const ACTIVITIES = [
  { src: "/vid1.mp4", title: "Fashion Design Practical", desc: "Hands-on garment construction session" },
  { src: "/vid2.mp4", title: "Bakery Class Highlights", desc: "Students mastering baking techniques" },
  { src: "/vid3.mp4", title: "Centre Activities Overview", desc: "Moments from training and community" },
];

export const ADMINS = [
  { id: "admin-1", name: "BSAC Admissions", role: "Centre Admin", wa: CONTACT.whatsapp },
  { id: "admin-2", name: "Training Coordinator", role: "Skills Admin", wa: CONTACT.whatsapp },
];

export const NAV_ITEMS = [
  { href: "/", label: "Home", navLabel: "Home", icon: "fa-home" },
  { href: "/apply", label: "Apply / Enrol", navLabel: "Enrol", icon: "fa-user-plus" },
  { href: "/activities", label: "Our Activities", navLabel: "Activities", icon: "fa-play-circle" },
  { href: "/connect", label: "Connect", navLabel: "Connect", icon: "fa-comments" },
] as const;
