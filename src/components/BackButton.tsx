"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigationHistory } from "@/hooks/use-navigation-history";

interface BackButtonProps {
  className?: string;
  showHome?: boolean;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
}

export default function BackButton({ 
  className = "", 
  showHome = false,
  variant = "outline",
  size = "default"
}: BackButtonProps) {
  const { canGoBack, goBack, navigateTo } = useNavigationHistory();

  if (!canGoBack) {
    return null;
  }

  const handleGoBack = () => {
    goBack();
  };

  const handleGoHome = () => {
    navigateTo("landing");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <Button
        variant={variant}
        size={size}
        onClick={handleGoBack}
        className="flex items-center gap-2"
        title="Retour en arrière"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </Button>
      
      {showHome && (
        <Button
          variant={variant}
          size={size}
          onClick={handleGoHome}
          className="flex items-center gap-2"
          title="Accueil"
        >
          <Home className="h-4 w-4" />
          <span>Accueil</span>
        </Button>
      )}
    </motion.div>
  );
}