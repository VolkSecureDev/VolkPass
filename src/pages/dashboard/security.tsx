import { useState } from "react";
import { Redirect } from "wouter";
import { Shield } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SecurityDashboard } from "@/components/dashboard/SecurityDashboard";
import { useAuth } from "@/components/auth-provider";

export default function SecurityPage() {
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

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
            <div className="flex items-center">
              <Shield className="mr-2 h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Security Dashboard</h1>
            </div>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Monitor and improve your password security
            </p>
          </div>
          
          <SecurityDashboard />
          
          <div className="mt-12 border-t pt-8 border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Security Tips</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-darkbg-card p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2 text-lg">Use a password manager</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Don't reuse passwords across different sites. A password manager helps you generate and store unique passwords.
                </p>
              </div>
              
              <div className="bg-white dark:bg-darkbg-card p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2 text-lg">Enable two-factor authentication</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Add an extra layer of security to your accounts by enabling two-factor authentication whenever possible.
                </p>
              </div>
              
              <div className="bg-white dark:bg-darkbg-card p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2 text-lg">Regularly check for breaches</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Periodically check if your accounts have been involved in any data breaches and change your passwords.
                </p>
              </div>
              
              <div className="bg-white dark:bg-darkbg-card p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2 text-lg">Use strong, unique passwords</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Create passwords that are at least 12 characters long with a mix of numbers, symbols, and both uppercase and lowercase letters.
                </p>
              </div>
              
              <div className="bg-white dark:bg-darkbg-card p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2 text-lg">Be cautious of phishing</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Don't click on suspicious links or provide your passwords in response to emails, even if they appear to be from legitimate sources.
                </p>
              </div>
              
              <div className="bg-white dark:bg-darkbg-card p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2 text-lg">Update software regularly</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Keep your devices and applications updated to protect against known security vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <MobileNav />
      </main>
    </div>
  );
}