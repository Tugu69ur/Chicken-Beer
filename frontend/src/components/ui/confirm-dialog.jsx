import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', danger = false, loading = false }) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={[
        <button key="cancel" onClick={onCancel} className="btn btn-secondary btn-sm">
          {cancelText}
        </button>,
        <button
          key="confirm"
          onClick={onConfirm}
          disabled={loading}
          className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`}
        >
          {loading ? 'Processing...' : confirmText}
        </button>,
      ]}
      centered
      width={420}
      className="premium-modal"
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-50 text-red-600' : 'bg-brand-red-soft text-brand-red'}`}>
          <ExclamationCircleOutlined style={{ fontSize: 20 }} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          {description && <p className="mt-1 text-sm text-ink-secondary">{description}</p>}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
