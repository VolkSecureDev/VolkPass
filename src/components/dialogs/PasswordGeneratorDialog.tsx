import { useState, useEffect } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Slider 
} from "@/components/ui/slider";
import {
  Switch
} from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatePasswordStrength, getStrengthLabel } from "@/lib/utils";

interface PasswordGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (password: string) => void;
}

export function PasswordGeneratorDialog({ 
  open, 
  onOpenChange,
  onSelect
}: PasswordGeneratorDialogProps) {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const strengthScore = calculatePasswordStrength(password);
  const strengthLabel = getStrengthLabel(strengthScore);
  
  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let chars = "";
    if (includeUppercase) chars += upper;
    if (includeLowercase) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    if (chars === "") chars = lower; // Fallback
    
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setPassword(result);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Password copied",
      description: "Password has been copied to clipboard",
    });
  };
  
  const handleUsePassword = () => {
    if (onSelect) {
      onSelect(password);
    }
    onOpenChange(false);
  };
  
  useEffect(() => {
    if (open) {
      generatePassword();
    }
  }, [open, length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);
  
  const getStrengthColor = () => {
    if (strengthLabel === "strong") return "bg-green-500";
    if (strengthLabel === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Password Generator</DialogTitle>
          <DialogDescription>
            Generate a secure password with custom settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-20 font-mono"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-10 top-0 h-10 w-10"
              onClick={generatePassword}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-10 w-10"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-1 mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Password strength: {strengthLabel}</span>
              <span>{strengthScore}/100</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-darkbg-card rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getStrengthColor()}`} 
                style={{ width: `${strengthScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="length">Password Length: {length}</Label>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              defaultValue={[16]}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
              <Label htmlFor="symbols">Symbols (!@#$)</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleUsePassword}>Use Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}