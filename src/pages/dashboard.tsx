import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SecurityDashboard } from "@/components/dashboard/SecurityDashboard";
import { PasswordsList } from "@/components/dashboard/PasswordsList";
import { AddPasswordTeaser } from "@/components/dashboard/AddPasswordTeaser";
import { AddPasswordDialog } from "@/components/dialogs/AddPasswordDialog";
import { PasswordGeneratorDialog } from "@/components/dialogs/PasswordGeneratorDialog";
import { useAuth } from "@/components/auth-provider";
import { usePasswords } from "@/hooks/use-passwords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { passwords } = usePasswords();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPasswordOpen, setIsAddPasswordOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Handle hash-based navigation for dialogs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (hash === "#add-password") {
        setIsAddPasswordOpen(true);
      } else if (hash === "#generator") {
        setIsGeneratorOpen(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check on initial load
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Clear hash when dialogs are closed
  useEffect(() => {
    if (!isAddPasswordOpen && window.location.hash === "#add-password") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (!isGeneratorOpen && window.location.hash === "#generator") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [isAddPasswordOpen, isGeneratorOpen]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <Sidebar />
      
      <main className="flex-1 bg-neutral-50 dark:bg-darkbg">
        <TopBar onSearchChange={setSearchTerm} />
        
        <div className="px-4 py-6 sm:px-6 lg:px-8 pb-20 md:pb-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Welcome back, {user.username}. Here's your password security overview.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-neutral-100 dark:bg-darkbg-card rounded-lg p-4">
                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Passwords</div>
                    <div className="text-3xl font-bold mt-1">{passwords.length}</div>
                  </div>
                  
                  <div className="bg-neutral-100 dark:bg-darkbg-card rounded-lg p-4">
                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Password Categories</div>
                    <div className="text-3xl font-bold mt-1">
                      {new Set(passwords.map((p: any) => p.category || "uncategorized")).size}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-100 dark:bg-darkbg-card rounded-lg p-4">
                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Last Updated</div>
                    <div className="text-3xl font-bold mt-1">
                      {passwords.length > 0 ? new Date(
                        Math.max(...passwords.map((p: any) => p.updatedAt ? new Date(p.updatedAt).getTime() : Date.now()))
                      ).toLocaleDateString() : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <SecurityDashboard />
          
          <div className="mt-8">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Your Passwords</h2>
            <PasswordsList searchTerm={searchTerm} />
          </div>
          
          <AddPasswordTeaser />
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
      />
      
      <PasswordGeneratorDialog
        open={isGeneratorOpen}
        onOpenChange={(open) => {
          setIsGeneratorOpen(open);
          if (!open && window.location.hash === "#generator") {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }}
      />
    </div>
  );
}
