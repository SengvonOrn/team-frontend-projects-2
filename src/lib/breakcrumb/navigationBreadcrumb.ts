export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className: string }>;
}

export interface BreadcrumbConfig {
  [key: string]: BreadcrumbItem[];
}
//==================================================
// Dynamic breadcrumb configuration
//==================================================
export const breadcrumbPaths: BreadcrumbConfig = {
  //============ Profile routes======================
  "/profile": [{ label: "Profile", path: "/profile" }],
  "/profile/overview": [
    { label: "Profile", path: "/profile" },
    { label: "Overview", path: "/profile" },
  ],
  "/profile/edit": [
    { label: "Profile", path: "/profile" },
    { label: "Edit Profile", path: "/profile" },
  ],
  "/profile/location": [
    { label: "My Location", path: "/location" },
    { label: "set Details", path: "/location" },
  ],
  "/profile/products": [
    { label: "Profile", path: "/profile" },
    { label: "Add Product", path: "/profile" },
  ],
  "/profile/settings": [
    { label: "Profile", path: "/profile" },
    { label: "Settings", path: "/profile" },
  ],
  "/profile/security": [
    { label: "Profile", path: "/profile" },
    { label: "Security", path: "/profile/security" },
  ],
  //================================================|
  // Orders routes
  //=================================================|

  "/orders": [{ label: "My Orders", path: "/orders" }],
  "/orders/[id]": [
    { label: "My Orders", path: "/orders" },
    { label: "Order Details", path: "/orders/[id]" },
  ],
  //===============================================|
  // Your store
  //===============================================|
  "/stores": [{ label: "My Stores", path: "/store" }],
  "/stores/[id]": [],

  //=====================was remve===========================|

  // Settings routes
  "/settings": [{ label: "Settings", path: "/settings" }],
  "/settings/account": [
    { label: "Settings", path: "/settings" },
    { label: "Account", path: "/settings/account" },
  ],
  "/settings/security": [
    { label: "Settings", path: "/settings" },
    { label: "Security & Privacy", path: "/settings/security" },
  ],
  "/settings/notifications": [
    { label: "Settings", path: "/settings" },
    { label: "Notifications", path: "/settings/notifications" },
  ],
  "/settings/preferences": [
    { label: "Settings", path: "/settings" },
    { label: "Preferences", path: "/settings/preferences" },
  ],
};

//=======================================================
/**
 * Get breadcrumb items for a given pathname
 * Supports dynamic routes like /orders/[id]
 */
//=======================================================

export const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  if (breadcrumbPaths[pathname]) {
    return breadcrumbPaths[pathname];
  }

  const segments = pathname.split("/").filter(Boolean);
  // Check for /orders/[id] pattern
  if (segments[0] === "orders" && segments[1]) {
    return (
      breadcrumbPaths["/orders/[id]"]?.map((item) => ({
        ...item,
        path: item.path === "/orders/[id]" ? pathname : item.path,
      })) || []
    );
  }

  



  // Fallback: create breadcrumbs from pathname
  return createBreadcrumbsFromPath(pathname);
};

//===================================================================
// Store Breakcrumbs
//===================================================================



//====================================================================
/**
 * Generate breadcrumbs from pathname if not found in config
 */
//====================================================================

const createBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = segment
      .replace(/\[id\]/g, "Details")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      label,
      path: currentPath,
    });
  });

  return breadcrumbs;
};

//=====================================
/**
 * Add new breadcrumb configuration
 */
//=====================================

export const addBreadcrumbPath = (
  path: string,
  items: BreadcrumbItem[]
): void => {
  breadcrumbPaths[path] = items;
};

//=====================================
/**
 * Remove breadcrumb configuration
 */
//=====================================

export const removeBreadcrumbPath = (path: string): void => {
  delete breadcrumbPaths[path];
};

/**
 * Get all available breadcrumb routes
 */
export const getAllBreadcrumbRoutes = (): string[] => {
  return Object.keys(breadcrumbPaths);
};
