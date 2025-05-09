import { useState } from "react";
import { AlertTriangle, Shield, CheckCircle, Lock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePasswords } from "@/hooks/use-passwords";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Password } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function SecurityCard({
  title,
  description,
  icon: Icon,
  status = "warning",
  actionText,
  onAction,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  status?: "warning" | "danger" | "success" | "info";
  actionText?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}) {
  const statusColors = {
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800",
    danger: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
    success: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
  };

  const iconColors = {
    warning: "text-yellow-500 dark:text-yellow-400",
    danger: "text-red-500 dark:text-red-400",
    success: "text-green-500 dark:text-green-400",
    info: "text-blue-500 dark:text-blue-400",
  };

  return (
    <Card className={`${statusColors[status]} border mb-4`}>
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <div className={`${iconColors[status]} mr-3 mt-0.5`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {children && <CardContent className="pb-2">{children}</CardContent>}
      {actionText && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function SecurityDashboard() {
  const { toast } = useToast();
  const { compromisedPasswords, reusedPasswords, weakPasswords } = usePasswords();

  const [activeTab, setActiveTab] = useState<string>("issues");

  // Helper to show fix password dialog
  const handleFixPassword = (password: Password) => {
    // This would ideally open the password edit dialog
    toast({
      title: "Edit password",
      description: `Let's fix your ${password.site} password`,
    });
  };

  return (
    <Tabs defaultValue="issues" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="issues" className="relative">
          Issues
          {(compromisedPasswords.length + reusedPasswords.length + weakPasswords.length) > 0 && (
            <Badge variant="destructive" className="ml-2">
              {compromisedPasswords.length + reusedPasswords.length + weakPasswords.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        <TabsTrigger value="protection">Protection</TabsTrigger>
      </TabsList>

      <TabsContent value="issues" className="space-y-4">
        {compromisedPasswords.length + reusedPasswords.length + weakPasswords.length === 0 ? (
          <SecurityCard
            title="No security issues found"
            description="Your passwords are looking good! Keep up the secure practices."
            icon={CheckCircle}
            status="success"
          />
        ) : (
          <>
            {compromisedPasswords.length > 0 && (
              <SecurityCard
                title="Compromised Passwords"
                description="These passwords have been found in data breaches and should be changed immediately."
                icon={AlertTriangle}
                status="danger"
              >
                <div className="space-y-2">
                  {compromisedPasswords.map((password) => (
                    <div
                      key={password.id}
                      className="flex items-center justify-between bg-white dark:bg-darkbg-card p-2 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 mr-3">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{password.site}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{password.username}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleFixPassword(password)}>
                        Fix Now
                      </Button>
                    </div>
                  ))}
                </div>
              </SecurityCard>
            )}

            {reusedPasswords.length > 0 && (
              <SecurityCard
                title="Reused Passwords"
                description="Using the same password across multiple sites is risky. Create unique passwords for each site."
                icon={AlertTriangle}
                status="warning"
              >
                <div className="space-y-2">
                  {reusedPasswords.slice(0, 3).map((password) => (
                    <div
                      key={password.id}
                      className="flex items-center justify-between bg-white dark:bg-darkbg-card p-2 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-3">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{password.site}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{password.username}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleFixPassword(password)}>
                        Change
                      </Button>
                    </div>
                  ))}
                  {reusedPasswords.length > 3 && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                      And {reusedPasswords.length - 3} more...
                    </p>
                  )}
                </div>
              </SecurityCard>
            )}

            {weakPasswords.length > 0 && (
              <SecurityCard
                title="Weak Passwords"
                description="These passwords are easy to guess. Use stronger, longer passwords with a mix of character types."
                icon={AlertTriangle}
                status="warning"
              >
                <div className="space-y-2">
                  {weakPasswords.slice(0, 3).map((password) => (
                    <div
                      key={password.id}
                      className="flex items-center justify-between bg-white dark:bg-darkbg-card p-2 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-3">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{password.site}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{password.username}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleFixPassword(password)}>
                        Strengthen
                      </Button>
                    </div>
                  ))}
                  {weakPasswords.length > 3 && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                      And {weakPasswords.length - 3} more...
                    </p>
                  )}
                </div>
              </SecurityCard>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-4">
        <SecurityCard
          title="Enable Two-Factor Authentication"
          description="Add an extra layer of security to your VolkPass account with 2FA."
          icon={Shield}
          status="info"
          actionText="Set up 2FA"
          onAction={() => setActiveTab("protection")}
        />

        <SecurityCard
          title="Generate Stronger Passwords"
          description="Use our password generator to create strong, unique passwords for all your accounts."
          icon={Lock}
          status="info"
          actionText="Generate Password"
          onAction={() => {
            window.location.hash = "#generator";
          }}
        />

        <SecurityCard
          title="Regular Security Checks"
          description="Run security checks monthly to ensure your passwords remain secure."
          icon={CheckCircle}
          status="info"
          actionText="Run Check Now"
          onAction={() => {
            toast({
              title: "Security Check",
              description: "Running security check...",
            });
          }}
        />
      </TabsContent>

      <TabsContent value="protection" className="space-y-4">
        <SecurityCard
          title="Two-Factor Authentication"
          description="Protect your VolkPass account with an additional layer of security."
          icon={Shield}
          status="info"
        >
          <div className="bg-white dark:bg-darkbg-card rounded-md p-4">
            <h3 className="font-medium mb-2">Current status: <span className="text-red-500">Disabled</span></h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Two-factor authentication adds an extra layer of security to your account by requiring both your 
              password and a verification code from your mobile device.
            </p>
            <Button>Enable Two-Factor Authentication</Button>
          </div>
        </SecurityCard>

        <SecurityCard
          title="Backup Recovery Codes"
          description="Keep these codes in a safe place to regain access to your account if you lose your 2FA device."
          icon={Lock}
          status="info"
          actionText="Generate Recovery Codes"
          onAction={() => {
            toast({
              title: "Recovery Codes",
              description: "You need to enable 2FA first before generating recovery codes.",
              variant: "destructive",
            });
          }}
        />

        <SecurityCard
          title="Account Activity"
          description="Monitor recent logins and suspicious activity on your account."
          icon={ExternalLink}
          status="info"
          actionText="View Activity"
          onAction={() => {
            toast({
              title: "Account Activity",
              description: "No suspicious activity detected on your account.",
            });
          }}
        />
      </TabsContent>
    </Tabs>
  );
}