import React from 'react';

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverEffect?: boolean;
  as?: React.ElementType; // Allow rendering as different elements e.g. 'article', 'li'
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  onClick,
  hoverEffect = false,
  as: Component = 'div',
}) => {
  const baseStyles = 'bg-brand-midnight-blue/50 p-6 rounded-lg shadow-lg backdrop-blur-sm border border-brand-champagne/10';
  const hoverStyles = hoverEffect ? 'transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-2 hover:ring-brand-gold/40 hover:scale-[1.02]' : '';

  return (
    <Component 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {title && (
        <h3 className="text-2xl font-serif text-brand-gold mb-4">
          {title}
        </h3>
      )}
      {children}
    </Component>
  );
};

export default Card; 