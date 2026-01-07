"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Globe,
  Trash2,
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PasswordForm } from "./PasswordFormProps";
import {
  PasswordError,
  PasswordFormData,
  SectionId,
  SettingsState,
} from "@/types/types";
import { Backend_URL } from "@/constants/ConstantsUrl";
import { useUserProfile } from "@/hooks/useUserProfile";
export const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    privateProfile: false,
    showActivity: true,
    allowMessages: true,
    marketingEmails: false,
    dataCollection: true,
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<PasswordError>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [activeSection, setActiveSection] = useState<SectionId>("account");
  const [saveStatus, setSaveStatus] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const { updatePassword } = useUserProfile();

  // ======================== SETTINGS HANDLERS ========================

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const handleSave = async () => {
    setSaveStatus("Saving...");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        setSaveStatus("Failed to save settings");
        setTimeout(() => setSaveStatus(""), 3000);
        return;
      }

      setSaveStatus("Settings saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("Error saving settings");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // ====================== PASSWORD HANDLERS ======================

  const validatePasswordForm = (data: PasswordFormData): boolean => {
    const newErrors: PasswordError = {};

    if (!data.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!data.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (data.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and numbers";
    }

    if (!data.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.newPassword !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (data.currentPassword === data.newPassword) {
      newErrors.general =
        "New password must be different from current password";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //===========================================================
  //
  //===========================================================
  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updatePassword(data);
      setPasswordSuccess(true);
    } catch (error) {
      alert(error);
    }
  };
  //===============================================================

  // ====================== SECTIONS CONFIG ======================

  const sections = [
    { id: "account" as const, label: "Account", icon: SettingsIcon },
    { id: "security" as const, label: "Security & Privacy", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "preferences" as const, label: "Preferences", icon: Globe },
    { id: "danger" as const, label: "Danger Zone", icon: Trash2 },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex gap-6 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <Card>
        {/* Account Settings */}
        {activeSection === "account" && (
          <div>
            <CardHeader className="bg-muted/50">
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your basic account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <SettingItem
                icon={Mail}
                label="Email Address"
                description="your.email@example.com"
                action={
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                }
              />
              <Separator />
              <SettingItem
                icon={Smartphone}
                label="Phone Number"
                description="No phone number added"
                action={
                  <Button variant="outline" size="sm">
                    Add
                  </Button>
                }
              />
              <Separator />
              <SettingItem
                icon={Lock}
                label="Password"
                description="Change your password to secure your account"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveSection("security")}
                  >
                    Update
                  </Button>
                }
              />
            </CardContent>
          </div>
        )}

        {/* Security & Privacy */}
        {activeSection === "security" && (
          <div>
            <CardHeader className="bg-muted/50">
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>
                Control your security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Change Password Section */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Change Password
                </h3>

                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-background border border-green-400 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800">
                      Password updated successfully!
                    </p>
                  </div>
                )}

                {passwordErrors.general && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-800">
                      {passwordErrors.general}
                    </p>
                  </div>
                )}

                <PasswordForm onSubmit={handlePasswordSubmit} />
                
              </div>

              <Separator />

              {/* Other Security Settings */}
              <ToggleSetting
                icon={Lock}
                label="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                enabled={settings.twoFactorAuth}
                onChange={() => handleToggle("twoFactorAuth")}
              />
              <Separator />
              <ToggleSetting
                icon={Eye}
                label="Private Profile"
                description="Make your profile private and control who can see your information"
                enabled={settings.privateProfile}
                onChange={() => handleToggle("privateProfile")}
              />
              <Separator />
              <ToggleSetting
                icon={Globe}
                label="Activity Status"
                description="Allow others to see when you're active"
                enabled={settings.showActivity}
                onChange={() => handleToggle("showActivity")}
              />
              <Separator />
              <ToggleSetting
                icon={Mail}
                label="Allow Messages"
                description="Let others send you direct messages"
                enabled={settings.allowMessages}
                onChange={() => handleToggle("allowMessages")}
              />
            </CardContent>
          </div>
        )}





        {/* Notifications */}
        {activeSection === "notifications" && (
          <div>
            <CardHeader className="bg-muted/50">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ToggleSetting
                icon={Mail}
                label="Email Notifications"
                description="Receive notifications via email"
                enabled={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
              />
              <Separator />
              <ToggleSetting
                icon={Bell}
                label="Push Notifications"
                description="Receive notifications on your device"
                enabled={settings.pushNotifications}
                onChange={() => handleToggle("pushNotifications")}
              />
              <Separator />
              <ToggleSetting
                icon={Mail}
                label="Marketing Emails"
                description="Receive emails about new features and promotions"
                enabled={settings.marketingEmails}
                onChange={() => handleToggle("marketingEmails")}
              />
              <Separator />
              <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <AlertDescription className="text-sm">
                  <strong>Tip:</strong> You'll always receive critical security
                  notifications regardless of these settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </div>
        )}

        {/* Preferences */}
        {activeSection === "preferences" && (
          <div>
            <CardHeader className="bg-muted/50">
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <PreferenceSelect
                label="Theme"
                description="Choose your preferred theme"
                options={["Light", "Dark", "System"]}
                defaultValue="System"
              />
              <Separator />
              <PreferenceSelect
                label="Language"
                description="Select your preferred language"
                options={["English", "Spanish", "French", "German"]}
                defaultValue="English"
              />
              <Separator />
              <ToggleSetting
                icon={Globe}
                label="Data Collection"
                description="Help us improve by sharing usage analytics"
                enabled={settings.dataCollection}
                onChange={() => handleToggle("dataCollection")}
              />
              <Separator />
              <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                <AlertDescription className="text-sm">
                  <strong>Privacy First:</strong> Your data is never sold. We
                  only use it to improve your experience.
                </AlertDescription>
              </Alert>
            </CardContent>
          </div>
        )}

        {/* Danger Zone */}
        {activeSection === "danger" && (
          <div>
            <CardHeader className="bg-destructive/10">
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription className="text-destructive/80">
                Irreversible actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <DangerButton
                icon={Trash2}
                label="Delete Account"
                description="Permanently delete your account and all associated data"
              />
              <Separator />
              <DangerButton
                icon={LogOut}
                label="Sign Out Everywhere"
                description="Sign out from all devices and sessions"
              />
              <Separator />
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  <strong>Warning:</strong> These actions cannot be undone.
                  Please proceed with caution.
                </AlertDescription>
              </Alert>
            </CardContent>
          </div>
        )}

        {/* Save Button */}
        {activeSection !== "security" && (
          <div className="border-t px-6 py-4 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              {saveStatus && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">{saveStatus}</span>
                </div>
              )}
            </div>
            <Button onClick={handleSave} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// Helper Components
const SettingItem = ({ icon: Icon, label, description, action }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

const ToggleSetting = ({
  icon: Icon,
  label,
  description,
  enabled,
  onChange,
}: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 flex-1">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch checked={enabled} onCheckedChange={onChange} />
  </div>
);

const PreferenceSelect = ({
  label,
  description,
  options,
  defaultValue,
}: any) => (
  <div>
    <div className="mb-3">
      <Label className="text-base font-medium">{label}</Label>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    <Select defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: string) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const DangerButton = ({ icon: Icon, label, description }: any) => (
  <div className="flex items-center justify-between p-4 border border-destructive/30 bg-destructive/5 rounded-lg hover:bg-destructive/10 transition-colors">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-destructive" />
      <div>
        <p className="font-medium text-destructive">{label}</p>
        <p className="text-sm text-destructive/80">{description}</p>
      </div>
    </div>
    <Button variant="destructive" size="sm">
      Proceed
    </Button>
  </div>
);
