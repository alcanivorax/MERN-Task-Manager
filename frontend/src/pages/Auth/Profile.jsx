import React, { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../../context/userContext";
import ProfileSelector from "../../components/Inputs/ProfileSelector";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import Navbar from "../../components/layouts/Navbar.jsx";

export default function Profile() {
  const { user, updateUser } = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [initialProfilePic, setInitialProfilePic] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setProfile(data);
      setForm({
        fullName: data.name || "",
        email: data.email || "",
      });
      setProfilePic(data.profileImageUrl || null);
      setInitialProfilePic(data.profileImageUrl || null);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const profilePicChanged = profilePic !== initialProfilePic;
    const nameChanged = form.fullName !== profile.name;
    const emailChanged = form.email !== profile.email;

    if (!nameChanged && !emailChanged && !profilePicChanged && !newPassword) {
      setError("No changes detected.");
      setLoading(false);
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      // Use default image if no profilePic
      const profileImageUrl =
        profilePic ||
        "https://res.cloudinary.com/dxdndmdmu/image/upload/w_200,h_200,c_fill,r_max/v1760534158/profile-uploads/kfi8mfxafeoa0jsndhlq.webp";

      const formData = {
        name: form.fullName,
        email: form.email,
        currentPassword,
        newPassword,
        profileImageUrl,
      };

      const { data } = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );

      setProfile(data);
      setSuccess("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setProfilePic(data.profileImageUrl || null);
      setInitialProfilePic(data.profileImageUrl || null);

      // Update global UserContext so dashboard sees new image
      updateUser({
        ...data,
        token: user.token, // keep existing token
        profileImageUrl: data.profileImageUrl,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!profile) return <div className="text-center p-4">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="w-full md:w-[60vw] px-12 pt-8 pb-12">
          <h2 className="text-lg font-medium text-black">Profile</h2>

          <div className="lg:w-full h-auto md:h-full mt-10 flex flex-col justify-center">
            <form onSubmit={handleSubmit}>
              <ProfileSelector
                image={profilePic}
                setImage={setProfilePic}
                setUploading={setUploading}
              />

              <div className="grid gap-4 mt-4">
                <Input
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                />
                <Input
                  value={form.email}
                  onChange={handleChange("email")}
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  value={currentPassword}
                  onChange={({ target }) => setCurrentPassword(target.value)}
                  label="Current Password"
                  placeholder="Enter current password"
                  type="password"
                />
                <Input
                  value={newPassword}
                  onChange={({ target }) => setNewPassword(target.value)}
                  label="New Password"
                  placeholder="Min 8 Characters"
                  type="password"
                />
              </div>

              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              {success && (
                <p className="text-green-500 text-xs mt-2">{success}</p>
              )}

              <button
                type="submit"
                className="btn-primary mt-4"
                disabled={loading || uploading}
              >
                {loading || uploading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
