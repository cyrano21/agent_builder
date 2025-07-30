"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home, History, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import BackButton from "./BackButton";

interface FloatingNavigationProps {
  className?: string;
  showHistory?: boolean;
}

export default function FloatingNavigation({ 
  className = "", 
  showHistory = false 
}: FloatingNavigationProps) {
  const { 
    canGoBack, 
    goBack, 
    navigateTo, 
    getBreadcrumbs, 
    history 
  } = useNavigationHistory();

  const breadcrumbs = getBreadcrumbs();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-6 left-6 z-50 ${className}`}
    >
      <div className="flex flex-col gap-3">
        {/* Bouton de retour principal */}
        {canGoBack && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={goBack}
              className="shadow-lg bg-background/90 backdrop-blur-sm border-2 hover:bg-background"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </Button>
          </motion.div>
        )}

        {/* Bouton Accueil */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigateTo("landing")}
            className="shadow-lg bg-background/90 backdrop-blur-sm border-2 hover:bg-background"
          >
            <Home className="h-5 w-5 mr-2" />
            Accueil
          </Button>
        </motion.div>

        {/* Historique de navigation */}
        {showHistory && history.length > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-background/90 backdrop-blur-sm border-2 rounded-lg p-3 shadow-lg max-w-xs"
          >
            <div className="flex items-center gap-2 mb-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Historique</span>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {history.slice(-5).map((item, index) => (
                <motion.div
                  key={`${item.view}-${item.timestamp}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateTo(item.view, item.path)}
                    className="w-full justify-start text-xs"
                  >
                    <Navigation className="h-3 w-3 mr-2" />
                    {item.title}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}