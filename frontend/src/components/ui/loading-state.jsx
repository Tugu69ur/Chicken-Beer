import React from 'react';

function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-6 ${className}`}>
      <Skeleton className="skeleton-image" />
      <Skeleton className="skeleton-title" />
      <SkeletonText lines={2} />
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
}

function SkeletonTable({ rows = 5, className = '' }) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-surface-dim">
        <Skeleton className="h-5 w-32" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-surface-dim last:border-b-0">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable };
export default Skeleton;
