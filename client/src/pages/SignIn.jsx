import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Prevent infinite loop by only navigating if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home page if authenticated
    }
  }, [isAuthenticated, navigate]);

  const colors = {
    bg:  '#F5F3EE',
    border:  '#E2DFD6',
    text:  '#1A1A1A',
    secondaryText:  '#6D6459',
    accent:  '#9B8759',
    inputBg:  '#FCFAF6',
    cardBg:  '#FCFAF6',
    hoverBg:  '#F5F3EE',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  const buttonStyle = {
    backgroundColor: colors.accent,
    color: colors.inputBg,
    border: `1px solid ${colors.accent}`,
    padding: '0.5rem',
    borderRadius: '4px',
    width: '100%',
    transition: 'all 0.2s ease',
  };

  const inputStyle = {
    backgroundColor: colors.inputBg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    padding: '0.5rem',
    borderRadius: '4px',
    width: '100%',
    marginTop: '0.25rem',
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-serif" style={{ backgroundColor: colors.bg }}>
      <div className="w-[400px] p-8 rounded-sm shadow-sm" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: colors.text }}>Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium" style={{ color: colors.text }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={inputStyle}
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium" style={{ color: colors.text }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={inputStyle}
              required
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            className="hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-center text-sm" style={{ color: "#E53E3E" }}>
            {error}
          </div>
        )}

        <p className="mt-4 text-center text-sm" style={{ color: colors.secondaryText }}>
          Don't have an account?{" "}
          <a href="/sign-up" style={{ color: colors.accent }} className="hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;