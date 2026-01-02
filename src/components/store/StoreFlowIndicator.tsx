"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Store,
  Plus,
  Sparkles,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getAvatarColor, getInitails } from "@/types/product";
import { UserData } from "@/types/user";

interface StoreFlowIndicatorProps {
  userData?: UserData | null;
  onCreateStore: () => void;
  onViewFollowers?: () => void;
  onViewStore?: () => void;
}

export const StoreFlowIndicator: React.FC<StoreFlowIndicatorProps> = ({
  userData,
  onCreateStore,
  onViewFollowers,
  onViewStore,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const hasStore = userData?.hasStore || false;
  const followerCount = userData?.followersCount || 0;

  const handleCreateStore = async () => {
    if (!hasStore) {
      setIsCreating(true);
      try {
        await onCreateStore();
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Profile + Followers */}
      <div
        className="relative group cursor-pointer"
        onClick={() => onViewFollowers?.()}
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          {userData?.profileImage?.profile ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${userData.profileImage.profile}`}
              alt={userData.username || "User"}
              className="w-8 h-8 rounded-full border-2 border-primary/30 object-cover"
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(
                userData?.name || ""
              )} flex items-center justify-center border-2 border-primary/30`}
            >
              <span className="text-xs font-bold text-white">
                {getInitails(userData?.name || "U")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {followerCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
          View Followers
        </div>
      </div>

      {/* Flow Arrow */}
      <div className="relative">
        <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
        <div className="absolute inset-0 animate-ping opacity-20">
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Store Icon */}
      <div
        className="relative group cursor-pointer"
        onClick={() => hasStore && onViewStore?.()}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            hasStore
              ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40"
              : "bg-gradient-to-br from-muted to-muted/50 border-2 border-dashed border-border group-hover:border-primary/50"
          }`}
        >
          <Store
            className={`w-7 h-7 ${
              hasStore ? "text-white" : "text-muted-foreground"
            }`}
          />
          {hasStore && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
          {hasStore ? "Store Active" : "No Store Yet"}
        </div>
      </div>

      {/* Create Store Button */}
      <Button
        onClick={handleCreateStore}
        disabled={hasStore || isCreating}
        className={`transition-all duration-200 flex items-center gap-2 ${
          hasStore || isCreating
            ? "opacity-50 cursor-not-allowed bg-muted"
            : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
        }`}
      >
        <Plus className="w-4 h-4" />
        {isCreating
          ? "Creating Store..."
          : hasStore
          ? "Store Created"
          : "Create Store"}
        {!hasStore && !isCreating && <Sparkles className="w-4 h-4" />}
      </Button>
    </div>
  );
};
