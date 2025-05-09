import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { Shield, LockKeyhole, User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { TwoFactorForm } from "@/components/auth/TwoFactorForm";
import logoImg from "../assets/v-logo.png";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  masterPassword: z.string().min(8, {
    message: "Master password must be at least 8 characters",
  }),
});

export default function Login() {
  const { login, user, isLoading, requires2FA, twoFactorUsername, verifyTwoFactor, verifyBackupCode } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      masterPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await login(values.username, values.masterPassword, isRegistering);
    // Result is handled by the auth provider - no need to do anything here
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user) {
    return <Redirect to="/dashboard" />;
  }
  
  // Show 2FA form if required
  if (requires2FA && twoFactorUsername) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-darkbg px-4 security-pattern">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <img src={logoImg} alt="VolkPass Logo" className="w-24 h-24" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0d5c7f] via-[#0f7d8c] to-[#15b09b] bg-clip-text text-transparent mb-1">
              VolkPass
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">Secure Password Manager</p>
          </div>
          
          <TwoFactorForm 
            username={twoFactorUsername} 
            onSuccess={(userData) => {
              // Authentication is handled by the auth provider
            }} 
          />
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-darkbg px-4 security-pattern">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="VolkPass Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0d5c7f] via-[#0f7d8c] to-[#15b09b] bg-clip-text text-transparent mb-1">
            VolkPass
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">Secure Password Manager</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isRegistering ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isRegistering 
                ? "Create your master password to secure your vault" 
                : "Enter your master password to unlock your vault"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-10" placeholder="username" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="masterPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Master Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            className="pl-10"
                            type="password"
                            placeholder="Master password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {isRegistering ? "Create Account" : "Unlock"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="link"
              className="text-sm text-neutral-600 dark:text-neutral-400"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Need an account? Create one"}
            </Button>
            
            <div className="flex items-center justify-center space-x-4 pt-2">
              <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                <KeyRound className="h-5 w-5 mr-2" />
                <span className="text-xs">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-xs">Zero-Knowledge</span>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        <p className="text-xs text-center mt-8 text-neutral-500 dark:text-neutral-500">
          VolkPass © {new Date().getFullYear()} - Your passwords, protected.
        </p>
      </div>
    </div>
  );
}
