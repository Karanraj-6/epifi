import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="toast-icon success" size={20} />,
  error: <AlertCircle className="toast-icon error" size={20} />,
  warning: <AlertTriangle className="toast-icon warning" size={20} />,
  info: <Info className="toast-icon info" size={20} />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            {icons[toast.type] || icons.info}
            <span className="toast-message">{toast.message}</span>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
