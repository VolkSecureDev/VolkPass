import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Shield, UserCog, KeyRound, Unlock, Users, RotateCcw, History } from "lucide-react";

// Admin Dashboard Layout
export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (!user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert className="max-w-lg">
          <Shield className="h-5 w-5" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin dashboard. Please contact a system administrator if you believe this is in error.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-darkbg">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Manage VolkPass users and recovery requests</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8 bg-neutral-100 dark:bg-darkbg-card">
            <TabsTrigger value="users" className="data-[state=active]:bg-teal-500/90 data-[state=active]:text-white">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="recovery" className="data-[state=active]:bg-teal-500/90 data-[state=active]:text-white">
              <KeyRound className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Recovery Requests</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-teal-500/90 data-[state=active]:text-white">
              <History className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Admin Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="recovery">
            <RecoveryRequests />
          </TabsContent>

          <TabsContent value="logs">
            <AdminLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// User Management Tab
function UserManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/users'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const reset2faMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest('POST', `/api/admin/users/${userId}/reset-2fa`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'Two-factor authentication has been reset',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to reset two-factor authentication',
        variant: 'destructive',
      });
    },
  });

  const unlockAccountMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest('POST', `/api/admin/users/${userId}/unlock`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'Account has been unlocked',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to unlock account',
        variant: 'destructive',
      });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: number; isAdmin: boolean }) => {
      return apiRequest('POST', `/api/admin/users/${userId}/toggle-admin`, { isAdmin });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'Admin privileges updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update admin privileges',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts, reset 2FA, and unlock accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>List of all registered users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {user.accountLocked ? (
                      <Badge variant="destructive">Locked</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.twoFactorEnabled ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        Disabled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge variant="default" className="bg-violet-500">Admin</Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserCog className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Manage</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage User: {user.username}</DialogTitle>
                            <DialogDescription>
                              Perform administrative actions on this user account.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="space-y-4">
                              <h3 className="font-medium">Account Actions</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Button
                                  onClick={() => unlockAccountMutation.mutate(user.id)}
                                  disabled={!user.accountLocked || unlockAccountMutation.isPending}
                                  variant="outline"
                                  className="justify-start"
                                >
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Unlock Account
                                </Button>
                                
                                <Button
                                  onClick={() => reset2faMutation.mutate(user.id)}
                                  disabled={!user.twoFactorEnabled || reset2faMutation.isPending}
                                  variant="outline"
                                  className="justify-start"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Reset 2FA
                                </Button>
                                
                                <Button
                                  onClick={() => toggleAdminMutation.mutate({ 
                                    userId: user.id, 
                                    isAdmin: !user.isAdmin 
                                  })}
                                  disabled={toggleAdminMutation.isPending}
                                  variant={user.isAdmin ? "default" : "outline"}
                                  className="justify-start"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  {user.isAdmin ? "Remove Admin" : "Make Admin"}
                                </Button>
                                
                                <ResetPasswordDialog userId={user.id} username={user.username} />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium">Account Information</h3>
                              <div className="bg-muted p-3 rounded-md text-sm">
                                <p><span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleString()}</p>
                                <p><span className="font-medium">Last Updated:</span> {new Date(user.updatedAt).toLocaleString()}</p>
                                <p><span className="font-medium">Recovery Email:</span> {user.recoveryEmail || 'Not set'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => {
                              document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
                            }}>
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Reset Password Dialog Component
function ResetPasswordDialog({ userId, username }: { userId: number; username: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const formSchema = z.object({
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { newPassword: string }) => {
      return apiRequest('POST', `/api/admin/users/${userId}/change-password`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: `Password has been reset for ${username}`,
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    changePasswordMutation.mutate({ newPassword: values.newPassword });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          <KeyRound className="h-4 w-4 mr-2" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for {username}. They can change it after logging in.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Enter new password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Confirm new password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Recovery Requests Tab
function RecoveryRequests() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: requests = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/recovery-requests'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const processRequestMutation = useMutation({
    mutationFn: async ({ 
      id, 
      action, 
      notes 
    }: { 
      id: number; 
      action: 'approve' | 'deny'; 
      notes?: string;
    }) => {
      return apiRequest('POST', `/api/admin/recovery-requests/${id}`, { action, notes: notes || '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/recovery-requests'] });
      toast({
        title: 'Success',
        description: 'Recovery request processed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to process recovery request',
        variant: 'destructive',
      });
    },
  });

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "password_reset":
        return <Badge variant="default">Password Reset</Badge>;
      case "2fa_reset":
        return <Badge variant="secondary">2FA Reset</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading recovery requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Requests</CardTitle>
        <CardDescription>
          Manage pending account recovery requests from users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>List of pending recovery requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests && requests.length > 0 ? (
              requests.map((request: any) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.userId}</TableCell>
                  <TableCell>{getRequestTypeBadge(request.type)}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date() > new Date(request.tokenExpiry) ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : (
                      new Date(request.tokenExpiry).toLocaleString()
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <RecoveryActionDialog 
                      request={request}
                      onProcess={({ action, notes }) => 
                        processRequestMutation.mutate({ 
                          id: request.id, 
                          action, 
                          notes 
                        })
                      }
                      isPending={processRequestMutation.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No pending recovery requests</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Recovery Action Dialog
function RecoveryActionDialog({ 
  request, 
  onProcess,
  isPending
}: { 
  request: any; 
  onProcess: ({ action, notes }: { action: 'approve' | 'deny'; notes?: string }) => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    action: z.enum(['approve', 'deny']),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: 'approve',
      notes: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onProcess(values);
    setOpen(false);
  };

  const isExpired = new Date() > new Date(request.tokenExpiry);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExpired}>
          Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Recovery Request</DialogTitle>
          <DialogDescription>
            Review and process the recovery request for User ID: {request.userId}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-md text-sm">
            <p><span className="font-medium">Request Type:</span> {request.type}</p>
            <p><span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleString()}</p>
            <p><span className="font-medium">Expires:</span> {new Date(request.tokenExpiry).toLocaleString()}</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={field.value === 'approve' ? 'default' : 'outline'}
                        onClick={() => form.setValue('action', 'approve')}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'deny' ? 'destructive' : 'outline'}
                        onClick={() => form.setValue('action', 'deny')}
                        className="flex-1"
                      >
                        Deny
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add notes about this decision (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes will be stored for audit purposes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant={form.getValues('action') === 'approve' ? 'default' : 'destructive'}
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : form.getValues('action') === 'approve' ? "Approve Request" : "Deny Request"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Admin Logs Tab
function AdminLogs() {
  const { data: logs = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/logs'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading admin logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Action Logs</CardTitle>
        <CardDescription>
          View administrative actions performed in the system for auditing purposes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Administrative action log history</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs && logs.length > 0 ? (
              logs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.adminId}</TableCell>
                  <TableCell>{log.userId || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={
                      log.action.includes('reset') ? 'secondary' :
                      log.action.includes('unlock') ? 'default' :
                      log.action.includes('grant') ? 'outline' :
                      log.action.includes('revoke') ? 'destructive' :
                      'outline'
                    }>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No admin action logs found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}