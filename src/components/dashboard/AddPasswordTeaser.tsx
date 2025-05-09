import { Shield, Key, ChevronRight } from "lucide-react";
import { usePasswords } from "@/hooks/use-passwords";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function AddPasswordTeaser() {
  const { passwords } = usePasswords();
  
  // Only show this component if the user has very few passwords
  if (passwords.length > 2) {
    return null;
  }
  
  return (
    <Card className="mt-8 border-dashed border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-darkbg-card">
      <CardHeader>
        <CardTitle className="text-xl">Get Started with VolkPass</CardTitle>
        <CardDescription>
          Securely store all your passwords in one place
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 dark:bg-primary/20">
              <Key className="h-5 w-5 text-primary dark:text-primary-light" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Store All Your Passwords</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Keep all your passwords in one secure place that only you can access.
            </p>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 dark:bg-primary/20">
              <Shield className="h-5 w-5 text-primary dark:text-primary-light" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Enhanced Security</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Get alerts for compromised, weak, or reused passwords to strengthen your security.
            </p>
          </div>
          
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 dark:bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">Two-Factor Authentication</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Add an extra layer of protection with two-factor authentication.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full sm:w-auto"
          onClick={() => {
            window.location.hash = "#add-password";
          }}
        >
          Add Your First Password
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}