import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { KeyRound, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

const codeFormSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

const backupFormSchema = z.object({
  backupCode: z
    .string()
    .min(8, "Backup code must be 8-10 characters")
    .max(10, "Backup code must be 8-10 characters"),
});

type TwoFactorFormProps = {
  username: string;
  onSuccess: (userData: any) => void;
};

export function TwoFactorForm({ username, onSuccess }: TwoFactorFormProps) {
  const [mode, setMode] = useState<"code" | "backup">("code");
  const { verifyTwoFactor, verifyBackupCode } = useAuth();
  const { toast } = useToast();
  
  // Form for verification code
  const codeForm = useForm<z.infer<typeof codeFormSchema>>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: "",
    },
  });
  
  // Form for backup code
  const backupForm = useForm<z.infer<typeof backupFormSchema>>({
    resolver: zodResolver(backupFormSchema),
    defaultValues: {
      backupCode: "",
    },
  });
  
  // Handle TOTP code submission
  const onSubmitCode = async (values: z.infer<typeof codeFormSchema>) => {
    try {
      await verifyTwoFactor(values.code);
      onSuccess({});
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    }
  };
  
  // Handle backup code submission
  const onSubmitBackup = async (values: z.infer<typeof backupFormSchema>) => {
    try {
      await verifyBackupCode(values.backupCode);
      onSuccess({});
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Invalid backup code",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <KeyRound className="h-8 w-8 text-primary dark:text-primary-light" />
          </div>
        </div>
        
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Logging in as <strong>{username}</strong>
        </p>
        
        <Tabs defaultValue="code" value={mode === "code" ? "code" : "backup"} onValueChange={(v) => setMode(v as "code" | "backup")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="code">Verification Code</TabsTrigger>
            <TabsTrigger value="backup">Backup Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code">
            <Form {...codeForm}>
              <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-4">
                <FormField
                  control={codeForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123456" 
                          {...field} 
                          maxLength={6}
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Verify
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="backup">
            <Form {...backupForm}>
              <form onSubmit={backupForm.handleSubmit(onSubmitBackup)} className="space-y-4">
                <FormField
                  control={backupForm.control}
                  name="backupCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backup Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="XXXX-XXXX" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Verify
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-start">
        <Button variant="link" className="px-0" onClick={() => window.location.reload()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}