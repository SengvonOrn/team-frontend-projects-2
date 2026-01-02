import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabType, menuItems } from "@/constants/userSideProfile";

interface ProfileSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
}) => (
  <Card className="rounded-xl shadow-sm h-fit">
    <CardContent className="p-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive
                ? "bg-orange-50 text-orange-600 border-2 border-orange-200"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Icon className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </button>
        );
      })}
    </CardContent>
  </Card>
);
