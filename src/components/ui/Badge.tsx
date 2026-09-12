import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'amber' | 'emerald' | 'rose' | 'slate' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  className = '',
  icon
}) => {
  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px] tracking-wider',
    sm: 'px-2.5 py-0.5 text-xs tracking-wider',
    md: 'px-3 py-1 text-xs tracking-wider'
  };

  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30',
    violet: 'bg-violet-500/10 text-violet-300 border border-violet-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    outline: 'bg-transparent text-slate-400 border border-slate-700/50'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md whitespace-nowrap uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0 text-current">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
