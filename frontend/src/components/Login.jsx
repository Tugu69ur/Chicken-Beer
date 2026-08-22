import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../constants.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X, User, Phone, Lock, Key, Eye, EyeOff, ArrowLeft } from 'lucide-react';

function Login({ onClose }) {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    otp: '',
  });

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Welcome back!');
        onClose();
        const role = data.user.role;
        if (role === 'admin') {
          window.location.href = '/admin-dashboard';
        } else if (role === 'client') {
          window.location.href = '/client-dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('OTP sent successfully');
        setOtpSent(true);
        setVerifyingOtp(true);
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error('Please enter OTP code');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: formData.otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('OTP verified');
        setVerifyingOtp(false);
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      toast.error('Please enter new password');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/otp/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successfully');
        setShowResetPassword(false);
        setOtpSent(false);
        setVerifyingOtp(false);
        setFormData({ phone: '', password: '', otp: '' });
      } else {
        toast.error(data.error || 'Password reset failed');
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red">Chicken2030</p>
              <h2 className="mt-1 text-xl font-bold text-ink">{showResetPassword ? 'Reset Password' : 'Sign In'}</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-surface-muted hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {!showResetPassword ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="label">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Send OTP
                  </button>
                </form>
              ) : verifyingOtp ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="label">OTP Code</label>
                    <div className="relative">
                      <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Enter OTP code"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Verify
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="label">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Reset Password
                  </button>
                </form>
              )}
            </>
          )}

          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            {!showResetPassword ? (
              <>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-brand-red hover:text-brand-red-hover transition"
                  onClick={onClose}
                >
                  Create an account
                </Link>
                <button
                  onClick={() => {
                    setShowResetPassword(true);
                    setFormData({ phone: '', password: '', otp: '' });
                    setOtpSent(false);
                    setVerifyingOtp(false);
                  }}
                  className="text-sm text-ink-muted hover:text-ink transition"
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowResetPassword(false);
                  setFormData({ phone: '', password: '', otp: '' });
                  setOtpSent(false);
                  setVerifyingOtp(false);
                }}
                className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition"
              >
                <ArrowLeft size={14} />
                Back to login
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;
