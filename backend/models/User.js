import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dxdndmdmu/image/upload/w_200,h_200,c_fill,r_max/v1760534158/profile-uploads/kfi8mfxafeoa0jsndhlq.webp",
    },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
