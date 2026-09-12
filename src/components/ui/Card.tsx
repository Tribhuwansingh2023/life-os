import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface' | 'elevated' | 'glass' | 'interactive';
  glowBorder?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  glowBorder = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-[#0c1017] border border-white/[0.08]',
    elevated: 'bg-[#111722] border border-white/[0.12] shadow-[0_12px_28px_rgba(0,0,0,0.5)]',
    glass: 'bg-[#0d121b]/80 backdrop-blur-md border border-white/[0.1]',
    interactive: 'bg-[#0c1017] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-[#101622] hover:-translate-y-0.5 transition-all duration-200'
  };

  const glowStyle = glowBorder ? 'shadow-[0_0_20px_rgba(0,240,255,0.15)] border-cyan-500/40' : '';

  return (
    <div
      className={`rounded-xl p-5 ${variantStyles[variant]} ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
