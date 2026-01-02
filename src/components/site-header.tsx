"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Header } from "@/components/navbar-hover";
import Image from "next/image";
import logo from "@/../public/images/LOGO.jpg";
import { TopNavbar } from "../components/ui/TopNavbar";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import Link from "next/link";

export function SiteHeader() {
  const { hideTop, blurHeader } = useScrollDetection(60, 100);
  return (
    <>
      {/* Top Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-transform duration-500 ${
          hideTop ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <TopNavbar />
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed left-0 right-0 z-40 flex h-25 items-center border-b transition-transform duration-500 ${
          hideTop ? "translate-y-0" : "translate-y-[40px]"
        } ${
          blurHeader
            ? "backdrop-blur-lg bg-background/70 shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="flex w-full items-center justify-evenly px-6">
          <div className="flex items-center justify-between gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={logo}
                  alt="Camben Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Camben</span>
                  <span className="text-xs">Open on The World</span>
                </div>
              </Link>
            </div>
          </div>
          <div>
            <Header />
          </div>
        </div>
      </header>
    </>
  );
}
