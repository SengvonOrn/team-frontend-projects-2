import {
  ShoppingBag,
  Home,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/utils";
import { IStore } from "@/types/store";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

interface Props {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  products: any[];
  currentStore?: IStore | null;
  userProfile?: UserProfile | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  products,
  currentStore,
  userProfile,
  isLoading = false,
  error = null,
}: Props) {
  if (isLoading) {
    return (
      <>
        <aside
          className={cn(
            "fixed lg:sticky lg:top-0 inset-y-0 left-0 w-72 bg-gradient-to-b from-background via-background to-muted/20 border-r transition-transform duration-300 z-50 flex flex-col h-screen lg:h-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="sticky top-0 z-10 p-6 border-b">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </>
    );
  }
  if (error) {
    return (
      <>
        <aside
          className={cn(
            "fixed lg:sticky lg:top-0 inset-y-0 left-0 w-72 bg-gradient-to-b from-background via-background to-muted/20 border-r transition-transform duration-300 z-50 flex flex-col h-screen lg:h-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="sticky top-0 z-10 p-6 border-b">
            <div className="text-destructive text-sm">
              <p className="font-semibold">Error loading store</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </>
    );
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: Home, badge: null },
    {
      id: "products",
      label: "All Products",
      icon: Package,
      badge: products.length,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
    },
  ];

  const quickStats = [
    {
      label: "Active",
      count: products.filter((p) => p.status === "active").length,
      color: "bg-green-500 dark:bg-green-600",
    },
    {
      label: "Draft",
      count: products.filter((p) => p.status === "draft").length,
      color: "bg-yellow-500 dark:bg-yellow-600",
    },
    {
      label: "Out of Stock",
      count: products.filter((p) => p.status === "out-of-stock").length,
      color: "bg-red-500 dark:bg-red-600",
    },
  ];

  // Get initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStoreInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ No need for firstStore extraction - currentStore is already single

  return (
    <>
      <aside
        className={cn(
          "fixed lg:sticky lg:top-0 inset-y-0 left-0 w-72 bg-gradient-to-b from-background via-background to-muted/20 border-r transition-transform duration-300 z-50 flex flex-col h-screen lg:h-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section - Sticky */}
        <div className="sticky top-0 z-10 p-6 border-b bg-gradient-to-b from-background via-background to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-md opacity-50" />
              <div className="relative p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Store Hub</h1>
              <p className="text-xs text-muted-foreground">Seller Dashboard</p>
            </div>
          </div>

          {/* Store Profile Section */}
          {currentStore && ( // ✅ Use currentStore directly
            <div className="p-3 bg-muted/50 rounded-lg border mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Current Store
              </p>
              <div className="flex items-center gap-2 mb-2">
                {currentStore.createdAt ? ( // ✅ Use logo from IStore
                  <img
                    src={currentStore.createdAt}
                    alt={currentStore.createdAt}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : currentStore.address ? ( // Fallback to address if logo doesn't exist
                  <img
                    src={currentStore.address}
                    alt={currentStore.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xs font-bold">
                    {getStoreInitials(currentStore.name || "Store")}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {currentStore.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {products.length} products
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User Profile */}
          {userProfile && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
              <Avatar className="w-10 h-10">
                {userProfile.avatar && (
                  <AvatarImage
                    src={userProfile.avatar}
                    alt={userProfile.name}
                  />
                )}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm">
                  {getUserInitials(userProfile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={cn(
                      "w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl transition-all group relative",
                      isActive && "shadow-lg"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-1 h-8 bg-primary-foreground rounded-r-full" />
                    )}
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-transform flex-shrink-0",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )}
                    />
                    <span className="font-medium flex-1 text-left">
                      {item.label}
                    </span>
                    {item.badge !== null && (
                      <Badge
                        variant={isActive ? "secondary" : "outline"}
                        className={cn(
                          "text-xs font-bold flex-shrink-0",
                          isActive &&
                            "bg-primary-foreground/20 border-primary-foreground/20"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Quick Stats */}
            <div className="p-4 bg-muted/30 rounded-xl border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Stats
              </p>
              <div className="space-y-3">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", stat.color)} />
                      <span className="text-sm text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs font-bold">
                      {stat.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Section - Sticky */}
        <div className="z-10 p-4 border-t space-y-3 bg-gradient-to-t from-background via-background to-transparent">
          {/* Store Stats */}
          {currentStore && (
            <div className="p-3 bg-muted/30 rounded-lg border text-xs">
              <p className="font-semibold mb-2">Store Stats</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Products:</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue:</span>
                  {/* <span className="font-semibold">
                    {currentStore.totalRevenue ? 
                      formatCurrency(currentStore.totalRevenue) : 
                      "$0"}
                  </span> */}
                </div>
                {currentStore.address && (
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-semibold truncate max-w-[120px]">
                      {currentStore.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upgrade Card */}
          <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              <Badge className="bg-yellow-500/20 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/30 dark:hover:bg-yellow-400/30 text-xs font-bold border-yellow-500/20">
                PRO
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Upgrade to unlock advanced features
            </p>
            <Button size="sm" className="w-full shadow-lg">
              Upgrade Now
            </Button>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
