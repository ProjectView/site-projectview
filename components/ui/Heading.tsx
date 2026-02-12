type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  as?: HeadingLevel;
  size?: 'hero' | 'section' | 'subsection';
  children: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<string, string> = {
  hero: 'text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] font-extrabold',
  section: 'text-[clamp(2rem,4.5vw,3.75rem)] leading-[1] font-bold',
  subsection: 'text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] font-bold',
};

export function Heading({
  as: Tag = 'h2',
  size = 'section',
  children,
  className = '',
}: HeadingProps) {
  return (
    <Tag
      className={`font-heading tracking-[-0.04em] ${sizeStyles[size]} ${className}`}
    >
      {children}
    </Tag>
  );
}
