import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

function EmptyState({ 
  title = 'No items found', 
  description = 'There are no items to display at the moment.', 
  action, 
  actionLabel, 
  icon,
  secondaryAction,
  secondaryActionLabel,
  className = '' 
}) {
  const navigate = useNavigate();

  const renderedAction = typeof action === 'function' ? (
    <Button type="primary" size="large" onClick={action} className="rounded-full">
      {actionLabel || 'Try Again'}
    </Button>
  ) : action || (
    <Button 
      type="primary" 
      size="large"
      onClick={() => navigate('/')}
      icon={<Home />}
      className="rounded-full"
    >
      {actionLabel || 'Back to Home'}
    </Button>
  );

  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {renderedAction}
        {secondaryAction && secondaryActionLabel && (
          <Button size="large" onClick={secondaryAction} className="rounded-full">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
