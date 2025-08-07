import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onClose,
}) => {
  const { signup, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      console.log("Attempting to sign up with:", {
        email: formData.email,
        name: formData.name,
        password: "***",
      });
      await signup(formData.email, formData.password, formData.name);
      console.log("Signup successful!");
      onClose();
    } catch (error) {
      console.error("Signup error:", error);
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-serif text-3xl font-bold text-luxury-black mb-2">
          Join Luxora
        </h2>
        <p className="text-gray-600">
          Create your account for exclusive access
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
              className="pl-12"
              fullWidth
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              className="pl-12"
              fullWidth
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              className="pl-12 pr-12"
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={formErrors.confirmPassword}
              className="pl-12 pr-12"
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="w-4 h-4 text-luxury-gold focus:ring-luxury-gold border-gray-300 rounded mt-1"
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the{" "}
            <button
              type="button"
              className="text-luxury-gold hover:text-luxury-gold-dark"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-luxury-gold hover:text-luxury-gold-dark"
            >
              Privacy Policy
            </button>
          </span>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-luxury-gold hover:text-luxury-gold-dark font-medium"
          >
            Sign in
          </button>
        </div>
      </form>
    </Card>
  );
};

export default SignupForm;
