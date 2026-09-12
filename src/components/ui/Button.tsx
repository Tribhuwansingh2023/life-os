import React from 'react';
import { audioService } from '../../services/audioService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      audioService.playTactileClick();
      if (onClick) onClick(e);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none tracking-wide text-xs sm:text-sm uppercase';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base font-semibold'
  };

  const variantStyles = {
    primary: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] shadow-[0_0_8px_rgba(0,240,255,0.15)]',
    secondary: 'bg-[#121824] text-slate-200 border border-white/10 hover:bg-[#1a2334] hover:border-white/20 hover:text-white',
    accent: 'bg-violet-600/20 text-violet-300 border border-violet-500/40 hover:bg-violet-600/30 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    gold: 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 hover:border-rose-400',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
