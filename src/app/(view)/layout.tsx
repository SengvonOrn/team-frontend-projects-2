import Image from "next/image";
import Link from "next/link";
import { Header } from "./navbar";
import { TopNavbar } from "@/components/ui/TopNavbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator"; // ✅

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed Header at Top */}
      <TopNavbar />
      <div className="flex items-center justify-between gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-camben.png"
              alt="Camben Logo"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold">Camben</span>
              <span className="text-xs">Open on The World</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="fixed  top-10 left-0 right-0 z-50 bg-background border-b">
        <Header />
      </div>

      {/* Main Content with Proper Padding */}
      <main className="pt-[120px] px-4 lg:px-20">{children}</main>
    </>
  );
}
