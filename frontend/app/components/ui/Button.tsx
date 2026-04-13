import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-primary text-bg-base hover:bg-primary-dark font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30",
  secondary:
    "bg-bg-surface-light text-text-primary hover:bg-bg-surface-hover font-medium",
  outline:
    "border border-border-light text-text-primary hover:bg-bg-surface-light hover:border-primary/50 font-medium",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-bg-surface-light font-medium",
  danger:
    "bg-error/10 text-error hover:bg-error/20 font-medium",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-bg-base";
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";
  const widthClass = fullWidth ? "w-full" : "";

  const allClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${widthClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={allClasses}
    >
      {children}
    </button>
  );
}
