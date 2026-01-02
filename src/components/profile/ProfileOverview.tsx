import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Shield,
  FileText,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Eye,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import { UserData } from "@/types/user";

interface ProfileOverviewProps {
  userData: UserData;
  onEdit: () => void;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  userData,
  onEdit,
}) => {
  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };
  const defaultLocation = userData.comments.find((loc) => loc.comment !== null);

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-pink-500 to-purple-600",
      "from-indigo-500 to-blue-600",
      "from-cyan-500 to-blue-600",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-600",
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <Card className="overflow-hidden">
      {/* Header with gradient background */}
      <div className="relative h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>
      <CardContent className="relative -mt-16 px-6 pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section: Avatar and User Info */}
          <div className="flex-1 space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                {userData.profileImage?.profile ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${userData.profileImage.profile}`}
                    alt={userData.name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-background shadow-xl ring-2 ring-primary/20"
                  />
                ) : (
                  <div
                    className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${getAvatarColor(
                      userData.name
                    )} flex items-center justify-center text-white font-bold text-4xl shadow-xl border-4 border-background ring-2 ring-primary/20`}
                  >
                    {getInitials(userData.name)}
                  </div>
                )}
                {/* Online Status */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background shadow-lg" />
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    {userData.name || "No Name"}
                    <Sparkles className="w-5 h-5 text-primary" />
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {userData.id}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {userData.role && (
                    <Badge variant="secondary" className="gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {userData.role}
                    </Badge>
                  )}
                  {userData.status && (
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-green-500/50 text-green-700 dark:text-green-400"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {userData.status}
                    </Badge>
                  )}
                </div>

                {/* Edit Button */}
                <Button onClick={onEdit} size="lg" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>

            <Separator />
            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfileDetail
                icon={FileText}
                label="Bio"
                value={userData.role}
              />
              <ProfileDetail icon={Phone} label="Phone" value={userData.role} />

              <ProfileDetail
                icon={MapPin}
                label="Address"
                value={
                  defaultLocation
                    ? `${defaultLocation.comment}, ${defaultLocation.rating}, ${defaultLocation.title}`
                    : "No address set"
                }
              />

              <ProfileDetail
                icon={Calendar}
                label="Member Since"
                value={
                  userData.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : undefined
                }
              />
            </div>
          </div>

          {/* Right Section: Stats */}
          <div className="lg:border-l lg:pl-8">
            <div className="flex flex-row lg:flex-col gap-6 lg:gap-8 justify-around lg:justify-center items-center lg:min-w-[280px]">
              {/* Stats Cards */}
              <StatsCard
                icon={Eye}
                value="0"
                label="Total Views"
                gradient="from-blue-500 to-purple-600"
              />

              <div className="hidden lg:block w-full">
                <Separator />
              </div>

              <StatsCard
                icon={ThumbsUp}
                value="0"
                label="Total Helpful"
                gradient="from-green-500 to-emerald-600"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  icon: React.ComponentType<{ className: string }>;
  value: string;
  label: string;
  gradient: string;
}> = ({ icon: Icon, value, label, gradient }) => (
  <div className="text-center space-y-2">
    <div
      className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div
      className={`text-5xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
    >
      {value}
    </div>
    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
      {label}
    </div>
  </div>
);

// Profile Detail Component
const ProfileDetail: React.FC<{
  icon: React.ComponentType<{ className: string }>;
  label: string;
  value?: string;
}> = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-accent/50 transition-colors">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-base font-medium truncate">{value}</p>
      </div>
    </div>
  );
};
