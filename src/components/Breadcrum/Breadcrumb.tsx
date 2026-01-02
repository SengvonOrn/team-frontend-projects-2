"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";
import {
  isCurrentPath,
  isLastBreadcrumb,
} from "@/lib/breakcrumb/breadcrumbUtils";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPath: string;
  maxItems?: number;
  showHome?: boolean;
  className?: string;
  separator?: React.ReactNode;
}
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  currentPath,
  maxItems = 5,
  showHome = true,
  className = "",
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
}) => {
  // Handle overflow with ellipsis
  const displayItems =
    items.length > maxItems
      ? [items[0], { label: "...", path: "#" }, ...items.slice(-maxItems + 2)]
      : items;
  return (
    <nav
      className={`sticky pt-3 z-20${className}`}
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <ol
          className="flex items-center gap-2 text-sm flex-wrap list-none"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {/* Home Link */}
          {showHome && (
            <>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-200 hover:text-orange-600 transition-colors duration-200 group cursor-pointer"
                  aria-label="Dashboard"
                  itemProp="item"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline" itemProp="name">
                    Dashboard
                  </span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              {items.length > 0 && (
                <li className="flex items-center" aria-hidden="true">
                  {separator}
                </li>
              )}
            </>
          )}

          {/* Breadcrumb Items */}
          {displayItems.map((item, index) => {
            const isCurrent = isCurrentPath(item.path, currentPath);
            const isLast = isLastBreadcrumb(index, displayItems.length);
            const isEllipsis = item.label === "...";
            const position = showHome ? index + 2 : index + 1;

            return (
              <React.Fragment key={`${item.path}-${index}`}>
                <li
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                  className="flex items-center gap-2"
                >
                  {isEllipsis ? (
                    <span className="text-gray-400 px-1" aria-hidden="true">
                      ...
                    </span>
                  ) : isCurrent ? (
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <item.icon className="w-4 h-4 text-orange-600" />
                      )}
                      <span
                        className="font-semibold"
                        aria-current="page"
                        itemProp="name"
                      >
                        {item.label}
                      </span>
                      <meta itemProp="position" content={position.toString()} />
                    </div>
                  ) : (
                    <>
                      <Link
                        href={item.path}
                        className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors duration-200 group"
                        itemProp="item"
                      >
                        {item.icon && (
                          <item.icon className="w-4 h-4 group-hover:text-orange-600" />
                        )}
                        <span className="group-hover:underline" itemProp="name">
                          {item.label}
                        </span>
                      </Link>
                      <meta itemProp="position" content={position.toString()} />
                    </>
                  )}
                </li>
                {/* Separator - not on last item */}
                {!isLast && !isEllipsis && (
                  <li className="flex items-center" aria-hidden="true">
                    {separator}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
