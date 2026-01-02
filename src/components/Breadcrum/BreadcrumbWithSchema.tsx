export default Breadcrumb;
import React from "react";
import Script from "next/script";
import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";

interface BreadcrumbWithSchemaProps {
  items: BreadcrumbItem[];
  currentPath: string;
  baseUrl?: string;
}

export const BreadcrumbWithSchema: React.FC<BreadcrumbWithSchemaProps> = ({
  items,
  currentPath,
  baseUrl = "https://yourdomain.com",
}) => {
  // Generate JSON-LD schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Dashboard",
        item: `${baseUrl}/dashboard`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `${baseUrl}${item.path}`,
      })),
    ],
  };

  return (
    <>
      <Breadcrumb items={items} currentPath={currentPath} />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </>
  );
};
