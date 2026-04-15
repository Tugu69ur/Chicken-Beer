import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../constants.js";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Нууц үг таарахгүй байна.");
    }

    try {
      const response = await fetch(`${BASE_URL}api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Бүртгэл амжилттай!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Бүртгэл амжилтгүй.");
      }
    } catch (error) {
      toast.error("Сүлжээний алдаа: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(216,29,30,.14),transparent_20%),linear-gradient(180deg,#fffaf6_0%,#f8f2ed_50%,#fff_100%)] py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="mx-auto max-w-md rounded-[36px] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D81E1E]">Chicken2030</p>
          <h2 className="mt-4 text-3xl font-black text-slate-900">Шинэ хэрэглэгч бүртгүүлэх</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Хурдан, найдвартай, халуун амттай захиалгын системд нэгдээрэй.
          </p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {[
            { label: "Нэр", name: "name", type: "text" },
            { label: "Утасны дугаар", name: "phone", type: "tel" },
            { label: "И-мэйл", name: "email", type: "email" },
            { label: "Нууц үг", name: "password", type: "password" },
            { label: "Нууц үг давтах", name: "confirmPassword", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="mt-2 block w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#D81E1E] focus:ring-2 focus:ring-[#D81E1E]/10"
              />
            </div>
          ))}

          <button type="submit" className="btn-brand w-full">
            Бүртгүүлэх
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Эсвэл <Link to="/" className="font-semibold text-[#D81E1E] hover:underline">нэвтрэх</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
