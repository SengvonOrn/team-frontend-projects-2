"use client";
import { useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * SessionMonitor component that automatically signs out users
 * when their session expires
 */
export function SessionMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = useCallback(async () => {
    try {
      // Clear the interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }

      // Sign out and redirect to login
      await signOut({ 
        redirect: true,
        callbackUrl: "/login"
      });
    } catch (error) {
      console.error("Error during sign out:", error);
      // Force redirect even if signOut fails
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    // Only monitor if user is authenticated
    if (status !== "authenticated" || !session) {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    // Check for session expiration
    const checkSessionExpiration = () => {
      const backendTokens = (session as any)?.backendTokens;
      
      // If there's an error in the session, sign out
      if ((session as any)?.error) {
        console.log("Session error detected, signing out...");
        handleSignOut();
        return;
      }

      // Check if backendTokens exist and have expiration
      if (backendTokens?.expiresIn) {
        const now = Date.now();
        const expiresIn = backendTokens.expiresIn;
        
        // If session has expired, sign out
        if (now >= expiresIn) {
          console.log("Session expired, signing out...");
          handleSignOut();
          return;
        }
      }
    };

    // Check immediately
    checkSessionExpiration();

    // Set up interval to check every 30 seconds
    checkIntervalRef.current = setInterval(checkSessionExpiration, 30000);

    // Cleanup on unmount
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [session, status, handleSignOut]);

  // This component doesn't render anything
  return null;
}

// components/SessionMonitor.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { usePathname } from 'next/navigation'

// export function SessionMonitor() {
//   const { data: session, status } = useSession()
//   const pathname = usePathname()
//   const [showLoginModal, setShowLoginModal] = useState(false)

//   useEffect(() => {
//     // Check if user was redirected due to auth requirement
//     const checkAuthRequired = () => {
//       const cookies = document.cookie.split('; ')
//       const authRequired = cookies.find(row => row.startsWith('auth-required='))
      
//       if (authRequired && status === 'unauthenticated') {
//         setShowLoginModal(true)
//         // Clear the cookie
//         document.cookie = 'auth-required=; Max-Age=0; path=/'
//       }
//     }

//     checkAuthRequired()
//   }, [pathname, status])

//   // Auto-show login popup when user is unauthenticated
//   useEffect(() => {
//     if (showLoginModal) {
//       // Trigger your login modal/popup here
//       // Example: dispatch a global event or update a context
//       window.dispatchEvent(new CustomEvent('show-login-modal'))
//     }
//   }, [showLoginModal])

//   return null // This component doesn't render anything
// }

