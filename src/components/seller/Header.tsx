import { Menu, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  onAddProduct: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  setSidebarOpen,
  sidebarOpen,
  onAddProduct,
}: Props) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="w-6 h-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Add Product Button */}
        <Button onClick={onAddProduct} className="gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Product</span>
        </Button>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4"
          />
        </div>
      </div>
    </header>
  );
}
