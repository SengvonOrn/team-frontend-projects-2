"use client";
import { SiteHeader } from "@/components/site-header";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed Header at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <SiteHeader />
      </div>

      {/* Main Content with Proper Padding */}
      <main className="pt-[120px] px-4 lg:px-20">{children}</main>
    </>
  );
}
