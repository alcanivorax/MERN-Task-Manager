import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input.jsx";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token); // Save token

        // 🔥 Fetch full user profile immediately after login
        const profileRes = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

        const fullUser = { ...profileRes.data, token };
        updateUser(fullUser);

        // ✅ No need to wait or setTimeout
        if (fullUser.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="flex flex-col"
      >
        <h3 className="text-2xl font-bold text-black">Welcome Back!</h3>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="roshan@gmail.com"
              type="text"
            />
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className={`btn-primary mt-2 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "LOGIN"}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-slate-700 mt-4 text-center"
          >
            Don't have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              to="/signup"
            >
              Sign Up
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
