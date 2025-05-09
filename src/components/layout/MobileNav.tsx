import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Home, 
  Key, 
  Settings, 
  Search, 
  Menu,
  X, 
  Shield, 
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user) return null;

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Fixed bottom bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-darkbg-card border-t border-neutral-200 dark:border-neutral-800 md:hidden z-10">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className={cn(
              "flex flex-col items-center justify-center w-16 p-2 rounded-md",
              location === "/dashboard" ? "text-primary dark:text-primary-light" : "text-neutral-600 dark:text-neutral-400"
            )}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => handleNavigation("/dashboard/passwords")}
            className={cn(
              "flex flex-col items-center justify-center w-16 p-2 rounded-md",
              location === "/dashboard/passwords" ? "text-primary dark:text-primary-light" : "text-neutral-600 dark:text-neutral-400"
            )}
          >
            <Key className="h-5 w-5 mb-1" />
            <span className="text-xs">Passwords</span>
          </button>

          <button
            onClick={() => handleNavigation("/dashboard/security")}
            className={cn(
              "flex flex-col items-center justify-center w-16 p-2 rounded-md",
              location === "/dashboard/security" ? "text-primary dark:text-primary-light" : "text-neutral-600 dark:text-neutral-400"
            )}
          >
            <Shield className="h-5 w-5 mb-1" />
            <span className="text-xs">Security</span>
          </button>

          <button
            onClick={() => setIsMenuOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center w-16 p-2 rounded-md",
              "text-neutral-600 dark:text-neutral-400"
            )}
          >
            <Menu className="h-5 w-5 mb-1" />
            <span className="text-xs">Menu</span>
          </button>
        </div>
      </div>

      {/* Full screen mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-darkbg z-50 md:hidden overflow-y-auto">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold mr-3">
                  V
                </div>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">VolkPass</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Menu items */}
            <div className="flex-1 p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-medium mb-2">Main</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => handleNavigation("/dashboard")}
                        className="w-full flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                      >
                        <Home className="h-5 w-5 mr-3" />
                        <span>Dashboard</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleNavigation("/dashboard/passwords")}
                        className="w-full flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                      >
                        <Key className="h-5 w-5 mr-3" />
                        <span>Passwords</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleNavigation("/dashboard/security")}
                        className="w-full flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                      >
                        <Shield className="h-5 w-5 mr-3" />
                        <span>Security</span>
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-medium mb-2">Settings</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => handleNavigation("/dashboard/settings")}
                        className="w-full flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        <span>Account Settings</span>
                      </button>
                    </li>
                    {user.isAdmin && (
                      <li>
                        <button 
                          onClick={() => handleNavigation("/admin")}
                          className="w-full flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                        >
                          <Settings className="h-5 w-5 mr-3" />
                          <span>Admin Dashboard</span>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{user.username}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}