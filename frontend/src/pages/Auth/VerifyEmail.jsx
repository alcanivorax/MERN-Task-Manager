import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { UserContext } from "../../context/userContext";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // No need to update user context since we're redirecting to login

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    setError("");
    setResendMsg("");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });

      const { token, user } = res.data;
      if (token) {
        setSuccess(true);

        // Navigate to login page after successful verification
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              message: "Email verified successfully! Please login to continue.",
              email: email,
            },
          });
        }, 500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP or server error.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email)
      return setError("Missing email. Please go back and sign up again.");

    setError("");
    setResendMsg("");
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, {
        email,
      });
      setResendMsg(res.data.message || "New OTP sent to your email.");
    } catch (err) {
      setError("Failed to resend OTP. Try again later.");
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="flex flex-col"
      >
        <h3 className="text-2xl font-bold text-black">Verify Your Email</h3>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Enter the 6-digit OTP sent to{" "}
          <span className="font-medium text-primary">{email}</span>
        </p>

        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-green-600 font-semibold mt-6"
          >
            ✓ Verification successful! Redirecting...
          </motion.div>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              label="OTP Code"
              placeholder="Enter 6-digit code"
              type="text"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}
            {resendMsg && <p className="text-green-600 text-xs">{resendMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Verifying..." : "VERIFY"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="btn-secondary border border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              Resend OTP
            </button>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
