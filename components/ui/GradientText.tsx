export function GradientText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange bg-[length:200%_200%] animate-gradient-shift ${className}`}
    >
      {children}
    </span>
  );
}
