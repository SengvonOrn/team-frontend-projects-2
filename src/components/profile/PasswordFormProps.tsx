"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordFormProps {
  onSubmit: (data: PasswordFormData) => Promise<void>;
  loading?: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Simple validation
  const validate = () => {
    const newErrors: Partial<PasswordFormData> = {};

    if (!formData.currentPassword) newErrors.currentPassword = "Required";
    if (!formData.newPassword) newErrors.newPassword = "Required";
    if (formData.newPassword && formData.newPassword.length < 8)
      newErrors.newPassword = "Minimum 8 characters";
    if (formData.confirmPassword !== formData.newPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <PasswordField
        label="Current Password"
        name="currentPassword"
        value={formData.currentPassword}
        error={errors.currentPassword}
        show={showPasswords.current}
        onToggleShow={() =>
          setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
        }
        onChange={handleChange}
      />
      {/* New Password */}
      <PasswordField
        label="New Password"
        name="newPassword"
        value={formData.newPassword}
        error={errors.newPassword}
        show={showPasswords.new}
        onToggleShow={() =>
          setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
        }
        onChange={handleChange}
      />

      {/* Confirm Password */}
      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        show={showPasswords.confirm}
        onToggleShow={() =>
          setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
        }
        onChange={handleChange}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
};

// Reusable password input field
interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  name,
  value,
  error,
  show,
  onToggleShow,
  onChange,
}) => (
  <div className="space-y-1">
    <Label htmlFor={name}>{label}</Label>
    <div className="relative">
      <Input
        id={name}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={error ? "border-red-500" : ""}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
