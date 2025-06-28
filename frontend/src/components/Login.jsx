import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ onClose }) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    otp: "",
  });

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Амжилттай нэвтэрлээ");
        onClose();
        const role = data.user.role;
        if (role === "admin") {
          window.location.href = "/admin-dashboard";
        } else if (role === "client") {
          window.location.href = "/client-dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        toast.error(data.message || "Нууц үг эсвэл утасны дугаар буруу байна");
      }
    } catch (err) {
      toast.error("Сүлжээний алдаа: " + err.message);
    }
  };

const handleSendOtp = async (e) => {
  e.preventDefault();

  if (!formData.phone) {
    toast.error("Утасны дугаар оруулна уу");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}api/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formData.phone }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success("OTP амжилттай илгээгдлээ");
      setOtpSent(true);
      setVerifyingOtp(true);
    } else {
      toast.error(data.error || "OTP илгээхэд алдаа гарлаа");
    }
  } catch (error) {
    toast.error("Сүлжээний алдаа: " + error.message);
  }
};


const handleVerifyOtp = async (e) => {
  e.preventDefault();

  if (!formData.otp) {
    toast.error("OTP код оруулна уу");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}api/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formData.phone, otp: formData.otp }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success("OTP баталгаажлаа");
      setVerifyingOtp(false);
    } else {
      toast.error(data.error || "OTP буруу байна");
    }
  } catch (error) {
    toast.error("Сүлжээний алдаа: " + error.message);
  }
};



  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      toast.error("Шинэ нууц үг оруулна уу");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/otp/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Нууц үг амжилттай шинэчлэгдлээ");
        setShowResetPassword(false);
        setOtpSent(false);
        setVerifyingOtp(false);
        setFormData({ phone: "", password: "", otp: "" });
      } else {
        toast.error(data.error || "Нууц үг шинэчлэхэд алдаа гарлаа");
      }
    } catch (error) {
      toast.error("Сүлжээний алдаа: " + error.message);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <ToastContainer position="top-center" autoClose={3000} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {!showResetPassword ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Нэвтрэх</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Утасны дугаар</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Утасны дугаар"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Нууц үг</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Нууц үг"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Нэвтрэх
              </button>
            </form>
            <div className="mt-4 text-center space-y-2">
              <Link
                to="/register"
                className="text-red-600 hover:text-red-700 block"
                onClick={onClose}
              >
                Бүртгүүлэх
              </Link>
              <button
                onClick={() => {
                  setShowResetPassword(true);
                  setFormData({ phone: "", password: "", otp: "" });
                  setOtpSent(false);
                  setVerifyingOtp(false);
                }}
                className="text-gray-600 hover:text-gray-700"
              >
                Нууц үг сэргээх
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Нууц үг сэргээх</h2>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Утасны дугаар</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Утасны дугаар"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  OTP илгээх
                </button>
              </form>
            ) : verifyingOtp ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">OTP код</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="OTP код"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Батлах
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Шинэ нууц үг</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Шинэ нууц үг"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Шинэчлэх
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowResetPassword(false)}
                className="text-gray-600 hover:text-gray-700"
              >
                Буцах
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
