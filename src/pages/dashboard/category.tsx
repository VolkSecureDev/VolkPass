import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PasswordsList } from "@/components/dashboard/PasswordsList";
import { usePasswords } from "@/hooks/use-passwords";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AddPasswordDialog } from "@/components/dialogs/AddPasswordDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

export default function CategoryPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/dashboard/category/:category");
  const category = params?.category || "";
  const { passwords } = usePasswords();
  const [isAddPasswordOpen, setIsAddPasswordOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter passwords by category
  const categoryPasswords = passwords.filter(
    (password) => password.category?.toLowerCase() === category.toLowerCase()
  );
  
  // Handle hash-based navigation for dialogs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (hash === "#add-password") {
        setIsAddPasswordOpen(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check on initial load
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    setLocation("/");
    return null;
  }
  
  // Format category name for display
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <Sidebar />
      
      <main className="flex-1 bg-neutral-50 dark:bg-darkbg">
        <TopBar onSearchChange={setSearchTerm} />
        
        <div className="px-4 py-6 sm:px-6 lg:px-8 pb-20 md:pb-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="mb-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Passwords
            </Button>
            
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formattedCategory} Passwords
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {categoryPasswords.length} items in this category
            </p>
          </div>
          
          {/* Use the reusable PasswordsList component with filtered data */}
          <PasswordsList 
            passwords={searchTerm 
              ? categoryPasswords.filter(p => 
                  p.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  p.username.toLowerCase().includes(searchTerm.toLowerCase()))
              : categoryPasswords
            }
          />
        </div>
        
        <MobileNav />
      </main>

      <AddPasswordDialog 
        open={isAddPasswordOpen} 
        onOpenChange={(open) => {
          setIsAddPasswordOpen(open);
          if (!open && window.location.hash === "#add-password") {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }}
        defaultCategory={category}
      />
    </div>
  );
}