import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function PageHeader({ title, subtitle, action, breadcrumb, className = '' }) {
  const navigate = useNavigate();

  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumb && (
        <nav className="mb-3 flex items-center gap-2 text-sm text-ink-muted">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.href ? (
                <button onClick={() => navigate(item.href)} className="hover:text-ink transition">
                  {item.label}
                </button>
              ) : (
                <span className="text-ink">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {action === 'back' && (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="rounded-full hover:bg-surface-muted"
              />
            )}
            {title && <h1 className="section-title">{title}</h1>}
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {action && action !== 'back' && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
