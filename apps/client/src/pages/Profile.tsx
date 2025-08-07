import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { uploadService } from "../services/uploadService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "USA",
    },
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "USA",
        },
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authService.updateProfile(formData);
      if (response.success) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setMessage(
          response.message || "Failed to update profile. Please try again."
        );
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-luxury-black mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and personal information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="relative inline-block mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-black text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadingImage(true);
                        try {
                          const result = await uploadService.uploadImage(file);
                          setFormData((prev) => ({
                            ...prev,
                            avatar: result.url,
                          }));
                          // Update profile with new avatar
                          await authService.updateProfile({
                            ...formData,
                            avatar: result.url,
                          });
                          setMessage("Profile picture updated successfully!");
                        } catch (error: any) {
                          setMessage(error.message || "Failed to upload image");
                        } finally {
                          setUploadingImage(false);
                        }
                      }
                    }}
                  />
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-600" />
                  )}
                </label>
              </div>{" "}
              <h2 className="font-serif text-xl font-bold text-luxury-black mb-1">
                {user.name}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-block px-3 py-1 bg-luxury-gold text-luxury-black rounded-full text-sm font-medium">
                  Administrator
                </span>
              )}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Member since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-luxury-black">
                  Personal Information
                </h3>
                <Button
                  variant={isEditing ? "outline" : "primary"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl ${
                    message.includes("success")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-12"
                      fullWidth
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-12"
                      fullWidth
                    />
                  </div>

                  <div className="relative md:col-span-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-12"
                      fullWidth
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-lg text-luxury-black mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-luxury-gold" />
                    Address Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Street Address"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </div>

                    <Input
                      label="City"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      fullWidth
                    />

                    <Input
                      label="State"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      fullWidth
                    />

                    <Input
                      label="ZIP Code"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      fullWidth
                    />

                    <Input
                      label="Country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={loading} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
