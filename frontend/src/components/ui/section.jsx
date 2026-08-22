function Section({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`animate-fade-in mb-8 ${className}`}>
      {(title || subtitle || action) && (
        <div className="section-header">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
                <span className="inline-block h-1 w-6 rounded-full bg-brand-red" />
              </div>
              {title && <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">{title}</h1>}
              {subtitle && <p className="mt-1.5 text-sm text-ink-secondary">{subtitle}</p>}
            </div>
            {action}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

export default Section;
