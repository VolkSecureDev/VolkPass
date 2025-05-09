import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { usePasswords } from "@/hooks/use-passwords";
import { Wand2, Eye, EyeOff, Lock, Import } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordGeneratorDialog } from "@/components/dialogs/PasswordGeneratorDialog";
import { calculatePasswordStrength, getStrengthLabel } from "@/lib/utils";

// Form schema with validation
const formSchema = z.object({
  site: z.string().min(1, "Site name is required"),
  url: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  category: z.string().optional(),
  notes: z.string().optional(),
});

type AddPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
};

export function AddPasswordDialog({ 
  open, 
  onOpenChange,
  defaultCategory = ""
}: AddPasswordDialogProps) {
  const { toast } = useToast();
  const { addPassword } = usePasswords();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  
  // Default form values
  const defaultValues = {
    site: "",
    url: "",
    username: "",
    password: "",
    category: defaultCategory,
    notes: "",
  };
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Get password value for strength calculation
  const watchPassword = form.watch("password");
  const strengthScore = calculatePasswordStrength(watchPassword);
  const strengthLabel = getStrengthLabel(strengthScore);
  
  // Function to get color based on strength
  const getStrengthColor = () => {
    if (strengthLabel === "strong") return "bg-green-500";
    if (strengthLabel === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await addPassword({
        site: data.site,
        url: data.url || "",
        username: data.username,
        password: data.password,
        category: data.category || "general",
        notes: data.notes || "",
      });
      
      toast({
        title: "Password added",
        description: `${data.site} password has been added to your vault.`,
      });
      
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add password. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle password generator selection
  const handlePasswordSelect = (generatedPassword: string) => {
    form.setValue("password", generatedPassword, { shouldValidate: true });
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Enter the details for the password you want to store.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username / Email</FormLabel>
                    <FormControl>
                      <Input placeholder="username@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={isPasswordVisible ? "text" : "password"}
                          {...field} 
                          className="pr-20"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsGeneratorOpen(true)} 
                            className="h-8 w-8 mr-1" 
                            size="icon"
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button"
                            variant="ghost"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="h-8 w-8 mr-2"
                            size="icon"
                          >
                            {isPasswordVisible ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    {watchPassword && (
                      <div className="mt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Strength: {strengthLabel}</span>
                          <span>{strengthScore}/100</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-darkbg-card rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${getStrengthColor()}`} 
                            style={{ width: `${strengthScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "general"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about this account"
                        className="resize-none"
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
                  onClick={() => onOpenChange(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">Add Password</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <PasswordGeneratorDialog
        open={isGeneratorOpen}
        onOpenChange={setIsGeneratorOpen}
        onSelect={handlePasswordSelect}
      />
    </>
  );
}