"use client";

import * as React from "react";
import Link from "next/link";

import { useCart } from "@/context/cart/CartContext";
import {
  ChevronDown,
  Images,
  Search,
  Heart,
  BarChart2,
  Globe,
  X,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HeaderSearchInput } from "@/components/buttonSearch/header-search-input";
import AuthDialog from "@/components/common/auth/AuthDialog";
import { ModeToggle } from "@/components/theme-toggler";

const allCategories = [
  { name: "Electronics", href: "/electronics", icon: "⚡️" },
  { name: "Books", href: "/books", icon: "📚" },
  { name: "Clothing", href: "/clothing", icon: "👕" },
  { name: "Home Goods", href: "/home", icon: "🏠" },
  { name: "Sports", href: "/sports", icon: "⚽️" },
];

export function Header() {
  const { data: session, status } = useSession();
  const [cachedUser, setCachedUser] = React.useState<typeof session | null>(
    null
  );

  React.useEffect(() => {
    if (session) {
      setCachedUser(session);
    }
  }, [session]);

  const displayUser = cachedUser || session;
  const loading = status === "loading" && !cachedUser;

  const [search, setSearch] = React.useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
    null
  );
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const { cartItems } = useCart();

  // Check if token refresh failed
  React.useEffect(() => {
    if (displayUser?.backendTokens && displayUser.backendTokens.expiresIn) {
      const now = Date.now();
      const isExpired = now >= displayUser.backendTokens.expiresIn;

      if (isExpired) {
        console.warn("Token expired, user needs to re-login");
      }
    }
  }, [displayUser]);

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageSearchClick = () => imageInputRef.current?.click();

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(URL.createObjectURL(file));
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const clearImageSearch = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
  };

  const inputLeftPadding = imagePreviewUrl ? "pl-20" : "pl-4";
  const inputRightPadding = imagePreviewUrl ? "pr-2" : "pr-4";

  const handleLogout = async () => {
    setCachedUser(null);
    await signOut({ redirect: false });
  };

  return (
    <header className="flex items-center justify-between w-full gap-6 p-4 bg-background border-b">
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          Store
        </div>
      </Link>

      {/* Search Bar */}
      <div className="flex items-center w-full max-w-2xl border border-input rounded-full focus-within:ring-2 focus-within:ring-ring transition-all duration-200 p-1 bg-background">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full space-x-1 flex-shrink-0"
            >
              <span>All Categories</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Search categories..."
                className="rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ul className="grid gap-1 mt-2 max-h-60 overflow-y-auto">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        href={cat.href}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted"
                      >
                        {cat.icon} {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground px-2 py-1.5">
                    No results found.
                  </li>
                )}
              </ul>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 bg-border" />

        <div className="flex flex-1 items-center relative">
          {imagePreviewUrl && (
            <div className="absolute left-2 flex items-center gap-1 z-10">
              <div className="relative h-7 w-7 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Image
                  src={imagePreviewUrl}
                  alt="Selected search image preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground p-0"
                onClick={clearImageSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <HeaderSearchInput
            className={`flex-1 !bg-transparent !border-none !ring-0 !outline-none !shadow-none focus:!ring-0 focus:!outline-none focus:!shadow-none text-base ${inputLeftPadding} ${inputRightPadding}`}
          />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageFileChange}
          style={{ display: "none" }}
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search by image"
          className="rounded-full"
          onClick={handleImageSearchClick}
        >
          <Images className="w-5 h-5" />
        </Button>
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Compare"
          className="hidden lg:inline-flex"
        >
          <BarChart2 className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Wishlist"
          className="hidden lg:inline-flex"
        >
          <Heart className="w-6 h-6" />
        </Button>

        {/* Cart Icon with badge */}
        <Link href="/cart" className="relative">
          <Button variant="ghost" size="icon" aria-label="Shopping cart">
            <span className="text-2xl">🛒</span>
          </Button>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">
              {cartItems.length}
            </span>
          )}
        </Link>

        <Separator
          orientation="vertical"
          className="h-6 mx-2 hidden md:block bg-border"
        />

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-md space-x-1 hidden md:flex"
            >
              <Globe className="w-5 h-5" />
              <span>English</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 p-2">
            <Link
              href="#"
              className="flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted"
            >
              🇰🇭 Khmer
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted"
            >
              🇬🇧 English
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auth Section */}
        {!loading && displayUser?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent transition">
                <div className="w-9 h-9 rounded-full bg-orange-600 dark:bg-orange-500 flex items-center justify-center font-bold text-white">
                  {displayUser.user.name?.charAt(0).toUpperCase() || (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <span className="hidden md:block font-medium">
                  {displayUser.user.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 p-2">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-medium truncate">{displayUser.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {displayUser.user.email}
                </p>
              </div>

              {/* Token Status Indicator */}
              {displayUser.backendTokens?.expiresIn && (
                <div className="px-3 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        Date.now() < displayUser.backendTokens.expiresIn
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-muted-foreground">
                      {Date.now() < displayUser.backendTokens.expiresIn
                        ? "Session Active"
                        : "Session Expired"}
                    </span>
                  </div>
                </div>
              )}

              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md hover:bg-muted text-sm mt-1"
              >
                Profile
              </Link>

              <Link
                href="/orders"
                className="block px-3 py-2 rounded-md hover:bg-muted text-sm"
              >
                My Orders
              </Link>

              <Link
                href="/settings"
                className="block px-3 py-2 rounded-md hover:bg-muted text-sm"
              >
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 text-sm mt-1"
              >
                Logout
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : !loading && !displayUser ? (
          <div className="flex gap-2">
            <AuthDialog type="login" />
            <AuthDialog type="register" />
          </div>
        ) : null}

        <Separator orientation="vertical" className="mx-2 h-6 bg-border" />

        {/* Mode Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
}
