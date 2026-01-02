import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Edit,
  Save,
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

//========================================
//  user function type
//=======================================
interface EditProfileFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    username: string;
  };
  saving: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  currentAvatar?: string;
  currentCover?: string;
  onAvatarChange?: (file: File | null) => void;
  onCoverChange?: (file: File | null) => void;
}

//=====================================
// Props
//=====================================

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  saving,
  onChange,
  onSubmit,
  onCancel,
  currentAvatar,
  currentCover,
  onAvatarChange,
  onCoverChange,
}) => {
  //================================================
  //  State Management
  //================================================

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentAvatar || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    currentCover || null
  );
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  //================================================================
  // Function  Change Avartar
  //================================================================

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAvatarChange?.(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  //=====================================================================
  //  Handle Change Covers
  //=====================================================================

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onCoverChange?.(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  //======================================================================

  const removeAvatar = () => {
    setAvatarPreview(null);
    onAvatarChange?.(null);
  };
  const removeCover = () => {
    setCoverPreview(null);
    onCoverChange?.(null);
  };

  //==========================================================================

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Edit className="w-6 h-6 text-primary" />
            Edit Profile
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Cover Photo Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Cover Photo
            </Label>
            <div className="relative group">
              {/* *============================= */}
              {/* Cover Preview */}
              {/* ============================== */}

              <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-background border-2 border-dashed border-muted-foreground/25">
                {coverPreview ? (
                  <>
                    <img
                      src={
                        coverPreview.startsWith("data")
                          ? coverPreview
                          : `${process.env.NEXT_PUBLIC_API_URL}${coverPreview}`
                      }
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          document.getElementById("cover-upload")?.click()
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={removeCover}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <label
                    htmlFor="cover-upload"
                    className="flex flex-col items-center justify-center h-full cursor-pointer"
                  >
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Click to upload cover photo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1200x400px
                    </p>
                  </label>
                )}
              </div>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>
          </div>

          {/* =============================== */}
          {/* Profile Picture Section */}
          {/* =============================== */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Profile Picture
            </Label>
            <div className="flex items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative group">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={
                        avatarPreview.startsWith("data:")
                          ? avatarPreview
                          : `${process.env.NEXT_PUBLIC_API_URL}${avatarPreview}`
                      }
                      alt="Avatar"
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-background shadow-xl ring-2 ring-primary/20"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          document.getElementById("avatar-upload")?.click()
                        }
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Upload Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={removeAvatar}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max 5MB
                </p>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* ============================== */}
          {/* Basic Information */}
          {/* ============================== */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                icon={User}
                label="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter your full name"
              />
              <FormField
                icon={Mail}
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          {/* ======================= */}
          {/* Password Section */}
          {/* ======================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Password
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
              >
                {showPasswordFields ? "Hide" : "Change Password"}
              </Button>
            </div>

            {showPasswordFields && (
              <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Leave password fields blank to keep your current password
                  </AlertDescription>
                </Alert>
                <FormField
                  icon={Lock}
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value=""
                  onChange={onChange}
                  placeholder="Enter current password"
                />
                <FormField
                  icon={Lock}
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="Enter new password"
                />
                <FormField
                  icon={Lock}
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value=""
                  onChange={onChange}
                  placeholder="Confirm new password"
                />
              </div>
            )}
          </div>

          {/* ======================== */}
          {/* Additional Information */}
          {/* ======================= */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Additional Information
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  icon={MapPin}
                  label="username"
                  name="username"
                  value={formData.username}
                  onChange={onChange}
                  placeholder="Your username"
                />
              </div>
            </div>
          </div>
          {/* ======================== */}
          {/* Action Buttons */}
          {/* ======================= */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="submit" size="lg" disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const FormField: React.FC<{
  icon: React.ComponentType<{ className: string }>;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}> = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);
