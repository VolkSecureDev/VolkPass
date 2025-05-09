import { useState } from "react";
import { ClipboardCopy, Eye, Edit, Globe, AtSign, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePasswords } from "@/hooks/use-passwords";
import { Password } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SortDesc, MenuSquare, LayoutGrid } from "lucide-react";

function getIconForSite(site: string) {
  const lowerSite = site.toLowerCase();
  
  if (lowerSite.includes("google") || lowerSite.includes("gmail")) {
    return <Globe className="h-6 w-6" />;
  } else if (lowerSite.includes("bank") || lowerSite.includes("chase") || lowerSite.includes("financial")) {
    return <CreditCard className="h-6 w-6" />;
  } else if (lowerSite.includes("mail") || lowerSite.includes("email")) {
    return <AtSign className="h-6 w-6" />;
  } else {
    return <Globe className="h-6 w-6" />;
  }
}

function getBackgroundForSite(site: string) {
  const lowerSite = site.toLowerCase();
  
  if (lowerSite.includes("google") || lowerSite.includes("gmail")) {
    return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
  } else if (lowerSite.includes("bank") || lowerSite.includes("chase") || lowerSite.includes("financial")) {
    return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
  } else if (lowerSite.includes("dropbox")) {
    return "bg-sky-100 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400";
  } else {
    return "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light";
  }
}

type StrengthBadgeProps = { strength: string };

function StrengthBadge({ strength }: StrengthBadgeProps) {
  // Normalize strength to one of the three values
  const normalizedStrength = 
    strength === "strong" ? "strong" : 
    strength === "medium" ? "medium" : "weak";
  if (normalizedStrength === "strong") {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 border-0">
        Strong
      </Badge>
    );
  } else if (normalizedStrength === "medium") {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-0">
        Medium
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 border-0">
        Weak
      </Badge>
    );
  }
}

interface PasswordsListProps {
  passwords?: Password[];
  title?: string;
  searchTerm?: string;
}

export function PasswordsList({ 
  passwords: propPasswords, 
  title = "All Passwords",
  searchTerm = "" 
}: PasswordsListProps) {
  const { passwords: hookPasswords, searchPasswords } = usePasswords();
  const [sortBy, setSortBy] = useState<"lastUsed" | "name">("lastUsed");
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Use passwords from props if provided, otherwise from hook
  const passwordsList = propPasswords || hookPasswords;

  const filteredPasswords = searchTerm
    ? passwordsList.filter(p => 
        p.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.username.toLowerCase().includes(searchTerm.toLowerCase()))
    : passwordsList;

  const sortedPasswords = [...filteredPasswords].sort((a, b) => {
    if (sortBy === "lastUsed") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return a.site.localeCompare(b.site);
    }
  });

  const handleCopyPassword = (password: Password) => {
    navigator.clipboard.writeText(password.password);
    toast({
      title: "Password copied",
      description: "Password has been copied to clipboard",
    });
  };

  const handleViewPassword = (password: Password) => {
    toast({
      title: "Password",
      description: password.password,
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {filteredPasswords.length} items
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm flex items-center">
                  <span>{sortBy === "lastUsed" ? "Last used" : "Name"}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("lastUsed")}>
                  Last used
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="h-6 w-px bg-neutral-200 dark:bg-darkbg-card"></div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "text-primary" : "text-neutral-500"}
          >
            <MenuSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "text-primary" : "text-neutral-500"}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button 
            className="inline-flex items-center"
            onClick={() => window.location.hash = "#add-password"}
          >
            <SortDesc className="-ml-1 mr-2 h-5 w-5" />
            Add Password
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-darkbg-surface overflow-hidden border border-neutral-200 dark:border-darkbg-card">
        {filteredPasswords.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No passwords found</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 dark:divide-darkbg-card">
            {sortedPasswords.map((password) => (
              <li key={password.id} className="hover:bg-neutral-50 dark:hover:bg-darkbg-card">
                <div className="px-4 py-4 sm:px-6 flex items-center">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-12 w-12 rounded-md flex items-center justify-center ${getBackgroundForSite(password.site)}`}>
                        {getIconForSite(password.site)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <div>
                        <p className="text-base font-medium text-neutral-900 dark:text-white truncate">
                          {password.site}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                          <span className="truncate">{password.username}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center space-x-2">
                        <StrengthBadge strength={password.strength} />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Updated {new Date(password.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyPassword(password)}
                          className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300 h-8 w-8"
                        >
                          <ClipboardCopy className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPassword(password)}
                          className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300 h-8 w-8"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300 h-8 w-8"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
