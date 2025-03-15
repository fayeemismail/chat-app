import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("");
      setLoading(true);

      if (form.password !== form.confirmPassword) {
        setErrorMessage("Passwords do not match!");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "User Created Successfully!",
          text: "You can now log in to your account.",
        }).then(() => {
          navigate("/sign-in");
        });
      } else {
        setErrorMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-serif bg-[#F5F3EE]">
      <div className="w-[400px] p-8 rounded-sm shadow-sm bg-[#FCFAF6] border border-[#E2DFD6]">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1A1A1A]">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-2 bg-[#FCFAF6] border border-[#E2DFD6] rounded-sm focus:outline-none focus:border-[#9B8759]"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 bg-[#FCFAF6] border border-[#E2DFD6] rounded-sm focus:outline-none focus:border-[#9B8759]"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A]">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 bg-[#FCFAF6] border border-[#E2DFD6] rounded-sm focus:outline-none focus:border-[#9B8759]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-[#9B8759] border border-[#9B8759] px-2 py-0.5 text-xs rounded-sm hover:opacity-90"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A1A1A]">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="mt-1 block w-full px-4 py-2 bg-[#FCFAF6] border border-[#E2DFD6] rounded-sm focus:outline-none focus:border-[#9B8759]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-[#9B8759] border border-[#9B8759] px-2 py-0.5 text-xs rounded-sm hover:opacity-90"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#9B8759] text-[#FCFAF6] border border-[#9B8759] rounded-sm hover:opacity-90 transition-opacity disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-[#6D6459]">
          Already have an account?{" "}
          <a href="/sign-in" className="text-[#9B8759] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;