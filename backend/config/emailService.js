import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_PASS, // Gmail App Password
  },
});

export const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Task Manager" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verify your email address</h2>
          <p>Your OTP code is:</p>
          <div style="font-size: 22px; font-weight: bold; color: #333;">${otp}</div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email}`);
  } catch (err) {
    console.error("❌ Error sending OTP via Gmail:", err);
    throw new Error("Failed to send OTP email");
  }
};
