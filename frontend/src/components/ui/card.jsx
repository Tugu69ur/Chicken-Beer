import React from 'react';

function Card({ children, className = '', hoverable = false, elevated = false, ...props }) {
  const baseClass = 'card';
  const hoverClass = hoverable ? 'card-interactive' : '';
  const elevatedClass = elevated ? 'card-elevated' : '';
  
  return (
    <div
      className={`${baseClass} ${hoverClass} ${elevatedClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`px-6 py-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-surface-dim px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
