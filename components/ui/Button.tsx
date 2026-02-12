import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  'relative inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]',
  secondary:
    'bg-white/[0.06] border border-white/[0.1] text-ink-primary hover:bg-white/[0.1] hover:border-white/[0.15]',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  ...props
}: ButtonProps) {
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
