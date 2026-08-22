import React from 'react';

function StatCard({ title, value, subtitle, trend, trendUp = true, icon, color = 'red', className = '' }) {
  const colorClasses = {
    red: 'text-brand-red bg-brand-red-soft',
    amber: 'text-brand-amber bg-brand-amber-soft',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  const iconColor = colorClasses[color] || colorClasses.red;

  return (
    <div className={`card card-elevated p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-ink-secondary uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-ink tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
              <span className="text-sm text-ink-muted">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconColor}`}>
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
