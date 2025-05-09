import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="volkpass-theme">
    <App />
    <Toaster />
  </ThemeProvider>
);
