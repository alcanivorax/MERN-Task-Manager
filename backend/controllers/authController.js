import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../config/emailService.js";

// ✅ Token generator
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🔹 REGISTER USER (send OTP instead of immediate login)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Determine role
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    // Send OTP via Gmail
    await sendOtpEmail(email, otp);

    res.status(201).json({
      message:
        "User registered. Please verify your email via OTP sent to your inbox.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via Gmail
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//@desc Register a new user
//@route POST /api/auth/login
//@access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user data with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//@desc Register a new user
//@route POST /api/auth/profile
//@access Private (Requires JWT)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user); // ✅ Success response
  } catch (error) {
    res.status(500).json({ message: "SERVER ERROR", error: error.message });
  }
};

//@desc Register a new user
//@route POST /api/auth/profile
//@access Private (Requires JWT)

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile image
    if (req.body.profileImageUrl !== undefined) {
      // Allow null or empty string to reset image if needed
      user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;
    }

    // Update name and email
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Update password only if both fields are provided
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "SERVER ERROR", error: error.message });
  }
};
