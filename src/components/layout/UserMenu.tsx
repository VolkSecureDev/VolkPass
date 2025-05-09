import { useState } from "react";
import { useLocation } from "wouter";
import { LogOut, UserCog, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";

type UserMenuProps = {
  className?: string;
};

export function UserMenu({ className }: UserMenuProps) {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn(
      "mt-auto p-4 border-t border-neutral-200 dark:border-neutral-800",
      className
    )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-2 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{user.username}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {user.isAdmin ? "Administrator" : "User"}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setLocation("/dashboard/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          {user.isAdmin && (
            <DropdownMenuItem onClick={() => setLocation("/admin")}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}