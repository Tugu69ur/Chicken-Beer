import React from 'react';
import { Tag } from 'antd';

function Badge({ children, variant = 'neutral', size = 'md', className = '' }) {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    neutral: 'badge-neutral',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'warning' },
    accepted: { label: 'Accepted', variant: 'info' },
    cooking: { label: 'Cooking', variant: 'warning' },
    delivering: { label: 'Delivering', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },
  };

  const config = statusConfig[status] || { label: status, variant: 'neutral' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export { Badge, StatusBadge };
export default Badge;
