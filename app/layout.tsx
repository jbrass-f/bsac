import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { CONTACT, SITE_URL, SOCIAL } from "@/lib/content";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BSAC | Brethren Skills Acquisition Center | EYN Church Utako Abuja",
  description:
    "Brethren Skills Acquisition Center (BSAC) provides professional skills acquisition empowerment at EYN Church Utako, Abuja. Fashion Design, Bakery and more.",
  keywords: [
    "BSAC", "Brethren Skills Acquisition Center", "EYN Church Utako", "Fashion Design", "Bakery",
    "Coding", "Adult Education", "Graphic Design", "Skills Acquisition Abuja",
  ],
  authors: [{ name: "BSAC" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "BSAC | Brethren Skills Acquisition Center Abuja",
    description:
      "Empowering lives through professional skills acquisition in Utako, Abuja. Register for Fashion Design, Bakery, Coding, Adult Education, and Graphic Design.",
    type: "website",
    url: "/",
    siteName: "BSAC - Brethren Skills Acquisition Center",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BSAC | Brethren Skills Acquisition Center Abuja",
    description: "Empowering lives through professional skills acquisition in Utako, Abuja.",
    images: ["/logo.png"],
  },
  icons: { icon: "/app.png", apple: "/app.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "BSAC" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#8B2E2E",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Brethren Skills Acquisition Center",
  alternateName: "BSAC",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  description: "Professional training center providing practical skills in Fashion Design, Bakery and more at EYN Church Utako, Abuja.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No.1 Teslim O. Elias Street, Near Old CBN Quarters, EYN Church Utako",
    addressLocality: "Abuja",
    addressRegion: "FCT",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: `+${CONTACT.whatsapp}`,
    contactType: "Admissions",
    email: CONTACT.email,
  },
  sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.youtube],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-cream text-ink overflow-x-hidden font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
