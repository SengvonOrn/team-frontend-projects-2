"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Store,
  BarChart3,
  Settings,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Home,
  Plus,
} from "lucide-react";
import { cn } from "@/utils/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: true,
    stores: true,
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const mainMenuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      href: "/dashboard/products",
      submenu: [
        {
          label: "All Products",
          href: "/dashboard/products",
          icon: Package,
        },
        {
          label: "Add Product",
          href: "/dashboard/add-product",
          icon: Plus,
        },
      ],
    },
    {
      id: "stores",
      label: "Stores",
      icon: Store,
      href: "/dashboard/stores",
      submenu: [
        {
          label: "My Stores",
          href: "/dashboard/stores",
          icon: Store,
        },
        {
          label: "Create Store",
          href: "/dashboard/stores/create",
          icon: Plus,
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 pt-[120px]",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Store size={24} className="text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Store Pro
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Seller Hub
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isMenuActive = isActive(item.href);
              const isExpanded = expandedMenus[item.id];

              return (
                <div key={item.id}>
                  {/* Main Menu Item */}
                  {!hasSubmenu ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        isMenuActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon size={20} />
                      {sidebarOpen && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                          isMenuActive
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          {sidebarOpen && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </div>
                        {sidebarOpen && (
                          <ChevronDown
                            size={18}
                            className={cn(
                              "transition-transform duration-200",
                              isExpanded ? "rotate-180" : ""
                            )}
                          />
                        )}
                      </button>

                      {/* Submenu */}
                      {hasSubmenu && isExpanded && sidebarOpen && (
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                          {item.submenu.map((subitem, idx) => {
                            const SubIcon = subitem.icon;
                            const isSubActive = isActive(subitem.href);

                            return (
                              <Link
                                key={idx}
                                href={subitem.href}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200",
                                  isSubActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                )}
                              >
                                {SubIcon && <SubIcon size={16} />}
                                {subitem.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
              )}
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* TOP BAR */}
        <div className="fixed top-[120px] left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X size={24} className="text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu size={24} className="text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Dashboard
            </Link>
            <span>›</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">
              {pathname.split("/").pop()?.replace(/-/g, " ") || "Overview"}
            </span>
          </div>

          <div className="w-12" />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto pt-[64px]">
          <div className="p-6 lg:p-8 space-y-6 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
