import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const formSchema = z.object({
  token: z.string().min(6, "Token must be at least 6 characters").max(8)
});

export function TwoFactorSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
    },
  });
  
  const startSetup = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/2fa/setup", {});
      
      setSetupData(response);
      setShowDialog(true);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Could not start 2FA setup. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/2fa/enable", { token: values.token });
      
      setSetupComplete(true);
      toast({
        title: "Success",
        description: "Two-factor authentication has been enabled.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Backup Codes - VolkPass</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #15b09b; }
              .code { font-family: monospace; padding: 8px; margin: 5px; border: 1px solid #ccc; display: inline-block; }
            </style>
          </head>
          <body>
            <h1>VolkPass Backup Codes</h1>
            <p>Keep these codes in a safe place. Each code can only be used once.</p>
            <div>
              ${setupData.backupCodes.map((code: string) => `<div class="code">${code}</div>`).join('')}
            </div>
            <p style="margin-top: 20px;">If you lose access to your authentication app, you can use one of these backup codes to sign in.</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  if (setupComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Two-factor authentication is enabled for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 font-semibold">Your account is now more secure!</p>
          <p className="text-sm text-muted-foreground mt-2">
            You will now be asked for a verification code when you sign in.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Close
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Increase your account security by enabling two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="text-sm font-medium leading-none mb-2">Why enable 2FA?</h4>
              <p className="text-sm text-muted-foreground">
                Two-factor authentication adds an extra layer of security to your account. 
                After entering your password, you'll need to enter a code from your authentication app.
              </p>
            </div>
            
            <div className="rounded-lg bg-muted p-4">
              <h4 className="text-sm font-medium leading-none mb-2">How it works</h4>
              <p className="text-sm text-muted-foreground">
                1. Set up an authenticator app on your phone (like Google Authenticator, Authy, or Microsoft Authenticator)
                <br />
                2. Scan the QR code or enter the secret key
                <br />
                3. Enter the verification code to confirm setup
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startSetup} disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Set Up Two-Factor Authentication"}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app or enter the secret key manually.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {setupData && (
              <>
                <div className="flex justify-center">
                  <img src={setupData.qrCodeUrl} alt="QR Code" className="border p-2 rounded" />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Or enter this code manually:</p>
                  <div className="font-mono bg-muted p-2 rounded select-all text-center">
                    {setupData.secret}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Backup Codes</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Save these backup codes in a secure place. They can be used if you lose access to your authenticator app.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {setupData.backupCodes.map((code: string, index: number) => (
                      <div key={index} className="font-mono bg-muted p-1 rounded text-center text-sm">
                        {code}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handlePrint} className="w-full mt-1">
                    Print Backup Codes
                  </Button>
                </div>
                
                <Separator />
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="token"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the 6-digit code"
                              {...field}
                              autoComplete="one-time-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify and Enable"}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}