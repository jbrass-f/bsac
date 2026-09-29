import Link from "next/link";

export default function SectionTitle({ children, subtitle, as: Tag = "h2" }: { children: React.ReactNode; subtitle?: string; as?: "h1" | "h2" }) {
  return (
    <div className="text-center mb-14">
      <Tag className="text-3xl md:text-4xl text-brand font-bold inline-block relative">
        {children}
        <span className="block w-20 h-1 bg-gold mx-auto mt-3" />
      </Tag>
      {subtitle && <p className="text-gray-600 mt-3 text-sm max-w-md mx-auto">{subtitle}</p>}
    </div>
  );
}

/** Heading block used at the top of the Apply / Activities / Connect pages. */
export function PageHeader({ title, subtitle, tag }: { title: string; subtitle: string; tag: string }) {
  return (
    <>
      <div className="flex items-center justify-between mb-8 no-print">
        <Link href="/" className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:underline">
          <i className="fas fa-arrow-left" /> Back to Homepage
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{tag}</span>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl text-brand font-bold">{title}</h1>
        <p className="text-gray-600 mt-2 text-sm max-w-xl mx-auto">{subtitle}</p>
        <span className="block w-20 h-1 bg-gold mx-auto mt-4" />
      </div>
    </>
  );
}
