"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SearchProvider } from "@/context/SearchContext";
// import { AuthProvider } from "@/context/auth/AuthContext";
import { CartProvider } from "@/context/cart/CartContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <SidebarInset className="relative">
          <SearchProvider>
            {/* <AuthProvider> */}
            <SessionProvider
            refetchInterval={5 * 60} // Refetch session every 5 minutes
              refetchOnWindowFocus={true} // Refetch when window regains focus
              >
              <CartProvider>{children}</CartProvider>
            </SessionProvider>
            {/* </AuthProvider> */}
          </SearchProvider>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
