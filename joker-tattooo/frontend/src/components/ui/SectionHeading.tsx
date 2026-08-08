export function SectionHeading({ eyebrow, title, text, level = 'h2' }: { eyebrow: string; title: string; text?: string; level?: 'h1' | 'h2' }) {
  const Heading = level;
  return <header className="section-heading"><p className="eyebrow">{eyebrow}</p><Heading>{title}</Heading>{text && <p>{text}</p>}</header>;
}
