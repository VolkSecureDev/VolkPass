import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import {
  Home,
  Star,
  Clock,
  AlertTriangle,
  Folder,
  KeyRound,
  Download,
  Settings,
  Shield,
  Sun,
  Moon,
  Plus,
  UserCog,
} from "lucide-react";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import logoImg from "../../assets/v-logo.png";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const passwordsNavItems: NavItem[] = [
    { name: "All Passwords", href: "/dashboard", icon: Home },
    { name: "Favorites", href: "/dashboard/favorites", icon: Star },
    { name: "Recently Used", href: "/dashboard/recent", icon: Clock },
    { name: "Weak Passwords", href: "/dashboard/weak", icon: AlertTriangle },
  ];

  const categoryNavItems: NavItem[] = [
    { name: "Work", href: "/dashboard/category/work", icon: Folder },
    { name: "Personal", href: "/dashboard/category/personal", icon: Folder },
    { name: "Financial", href: "/dashboard/category/financial", icon: Folder },
  ];

  const toolsNavItems: NavItem[] = [
    { name: "Password Generator", href: "/dashboard/generator", icon: KeyRound },
    { name: "Import/Export", href: "/dashboard/import-export", icon: Download },
  ];

  const settingsNavItems: NavItem[] = [
    { name: "Account Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Security", href: "/dashboard/security", icon: Shield },
  ];

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  if (!user) return null;

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-darkbg-surface border-r border-neutral-200 dark:border-darkbg-card md:h-screen md:sticky md:top-0 md:flex-shrink-0 transition-all duration-300 dark:text-white">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-darkbg-card">
        <div className="flex items-center space-x-2">
          <img src={logoImg} alt="VolkPass Logo" className="w-8 h-8" />
          <span className="text-lg font-bold text-gradient">VolkPass</span>
        </div>
        <button 
          className="md:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-darkbg-card"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn("md:block p-4 space-y-6", isMobileMenuOpen ? "block" : "hidden")}>
        <div>
          <p className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-medium mb-2">Passwords</p>
          <ul className="space-y-1">
            {passwordsNavItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-darkbg-card",
                    location === item.href 
                      ? "bg-primary/10 text-primary dark:text-primary-light dark:bg-primary/20" 
                      : "text-neutral-700 dark:text-neutral-300"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-medium mb-2">Categories</p>
          <ul className="space-y-1">
            {categoryNavItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className="flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <Button
            variant="link"
            size="sm"
            className="mt-2 text-primary dark:text-primary-light p-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Category</span>
          </Button>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-medium mb-2">Tools</p>
          <ul className="space-y-1">
            {toolsNavItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className="flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-medium mb-2">Settings</p>
          <ul className="space-y-1">
            {settingsNavItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className="flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            {user.isAdmin && (
              <li>
                <Link 
                  href="/admin"
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-darkbg-card",
                    location === "/admin" 
                      ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-600/20" 
                      : "text-neutral-700 dark:text-neutral-300"
                  )}
                >
                  <UserCog className="h-5 w-5 mr-3" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            )}
            <li>
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-darkbg-card"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 mr-3" />
                ) : (
                  <Moon className="h-5 w-5 mr-3" />
                )}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Menu (bottom of sidebar) */}
      <UserMenu className="hidden md:flex" />
    </aside>
  );
}
