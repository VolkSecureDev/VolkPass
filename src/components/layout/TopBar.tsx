import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Search, 
  Bell, 
  Settings, 
  Plus,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";

type TopBarProps = {
  onSearchChange?: (term: string) => void;
  allowPasswordAdd?: boolean;
};

export function TopBar({ onSearchChange, allowPasswordAdd = true }: TopBarProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  }, [searchTerm, onSearchChange]);

  if (!user) return null;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPassword = () => {
    // Add password using hash-based navigation
    window.location.hash = "add-password";
  };

  const toggleMobileSearch = () => {
    setShowSearchOnMobile(prev => !prev);
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-darkbg-card border-b border-neutral-200 dark:border-neutral-800">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Page Title - Only on mobile */}
        <h1 className="text-lg font-bold text-neutral-900 dark:text-white md:hidden">
          {location === "/dashboard" && "Dashboard"}
          {location === "/dashboard/passwords" && "Passwords"}
          {location === "/dashboard/security" && "Security"}
          {location === "/dashboard/settings" && "Settings"}
          {location.startsWith("/dashboard/category/") && 
            (() => {
              const category = location.split("/").pop() || "";
              return category.charAt(0).toUpperCase() + category.slice(1);
            })()
          }
        </h1>

        {/* Search Bar - Hidden on mobile unless activated */}
        <div className={cn(
          "w-full max-w-md md:flex items-center relative",
          showSearchOnMobile ? "flex absolute top-0 left-0 right-0 p-4 bg-white dark:bg-darkbg-card z-20" : "hidden"
        )}>
          <Input
            type="search"
            placeholder="Search passwords..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="h-4 w-4 text-neutral-400 absolute left-3" />
          {showSearchOnMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={toggleMobileSearch}
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          {!showSearchOnMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 dark:text-white mb-1">Notifications</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Stay updated on security alerts and breach notifications.</p>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-800 py-2">
                <div className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 mr-3 mt-1">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">Password Breach Detected</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Your Netflix password was found in a recent data breach. Please change it immediately.</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Password Button */}
          {allowPasswordAdd && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAddPassword}
              className="hidden md:flex"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Password</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}