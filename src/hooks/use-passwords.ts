import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Password } from "@shared/schema";
import { getStrengthLabel, calculatePasswordStrength } from "@/lib/utils";

interface PasswordCreateData {
  site: string;
  url: string;
  username: string;
  password: string;
  category: string;
  notes: string;
}

interface PasswordsResult {
  passwords: Password[];
  isLoading: boolean;
  addPassword: (data: PasswordCreateData) => Promise<Password>;
  updatePassword: (id: number, data: Partial<PasswordCreateData>) => Promise<Password>;
  deletePassword: (id: number) => Promise<void>;
  searchPasswords: (query: string) => Password[];
  compromisedPasswords: Password[];
  reusedPasswords: Password[];
  weakPasswords: Password[];
}

export function usePasswords(): PasswordsResult {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Password[]>([]);

  // Fetch all passwords
  const { data: passwords = [], isLoading } = useQuery({
    queryKey: ["/api/passwords"],
  });

  // Add password mutation
  const addMutation = useMutation({
    mutationFn: async (data: PasswordCreateData) => {
      const res = await apiRequest("POST", "/api/passwords", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      toast({
        title: "Password added",
        description: "Your password has been securely stored",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add password",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PasswordCreateData> }) => {
      const res = await apiRequest("PATCH", `/api/passwords/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      toast({
        title: "Password updated",
        description: "Your password has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update password",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete password mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/passwords/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      toast({
        title: "Password deleted",
        description: "Your password has been removed from your vault",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete password",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Search function
  const searchPasswords = (query: string) => {
    if (!query.trim()) return passwords;
    
    const results = passwords.filter((password: Password) => {
      const searchFields = [
        password.site,
        password.url,
        password.username,
        password.category,
        password.notes,
      ];
      
      const lowerQuery = query.toLowerCase();
      return searchFields.some(
        (field) => field && field.toLowerCase().includes(lowerQuery)
      );
    });
    
    setSearchResults(results);
    return results;
  };

  // Find compromised passwords (in a real app, this would check against breach databases)
  const compromisedPasswords = passwords.filter(
    (password: Password) => password.compromised
  );

  // Find reused passwords
  const reusedPasswords = (() => {
    const passwordMap = new Map<string, Password[]>();
    
    passwords.forEach((password: Password) => {
      const existingList = passwordMap.get(password.password) || [];
      passwordMap.set(password.password, [...existingList, password]);
    });
    
    const reused: Password[] = [];
    passwordMap.forEach((passwordList) => {
      if (passwordList.length > 1) {
        reused.push(...passwordList);
      }
    });
    
    return reused;
  })();

  // Find weak passwords
  const weakPasswords = passwords.filter(
    (password: Password) => password.strength === "weak"
  );

  // Handler functions
  const addPassword = async (data: PasswordCreateData) => {
    return addMutation.mutateAsync({
      ...data,
      strength: getStrengthLabel(calculatePasswordStrength(data.password)),
      compromised: false,
      updatedAt: new Date().toISOString(),
    });
  };

  const updatePassword = async (id: number, data: Partial<PasswordCreateData>) => {
    const updateData = { ...data };
    
    // If password is changing, recalculate strength
    if (data.password) {
      updateData.strength = getStrengthLabel(calculatePasswordStrength(data.password));
    }
    
    return updateMutation.mutateAsync({ 
      id, 
      data: {
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const deletePassword = async (id: number) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    passwords,
    isLoading,
    addPassword,
    updatePassword,
    deletePassword,
    searchPasswords,
    compromisedPasswords,
    reusedPasswords,
    weakPasswords,
  };
}
