import { usePathname } from "next/navigation";
import { getBreadcrumbItems } from "@/lib/breakcrumb/navigationBreadcrumb";

export const useBreadcrumb = () => {
  const pathname = usePathname();
  const items = getBreadcrumbItems(pathname);

  return {
    items,
    currentPath: pathname,
  };
};
