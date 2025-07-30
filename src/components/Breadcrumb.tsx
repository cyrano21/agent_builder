"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationHistoryItem } from "@/hooks/use-navigation-history";

interface BreadcrumbProps {
  items: NavigationHistoryItem[];
  canGoBack: boolean;
  onNavigate: (item: NavigationHistoryItem) => void;
  onGoBack: () => void;
  maxItems?: number;
}

export default function Breadcrumb({ 
  items, 
  canGoBack, 
  onNavigate, 
  onGoBack,
  maxItems = 5 
}: BreadcrumbProps) {
  // Limiter le nombre d'éléments affichés
  const displayItems = items.slice(-maxItems);
  
  // Si on a plus d'éléments que la limite, ajouter un indicateur "..."
  const hasMoreItems = items.length > maxItems;
  
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-sm">
      {/* Bouton de retour en arrière */}
      {canGoBack && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="h-8 w-8 p-0 mr-2"
            title="Retour en arrière"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
      
      {/* Accueil toujours visible */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate({ view: "landing", title: "Accueil", timestamp: Date.now() })}
          className="h-8 px-2 py-1 text-xs"
        >
          <Home className="h-3 w-3 mr-1" />
          Accueil
        </Button>
      </motion.div>
      
      {/* Indicateur "..." si nécessaire */}
      {hasMoreItems && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-muted-foreground"
        >
          <ChevronRight className="h-3 w-3" />
          <span className="mx-1">...</span>
        </motion.div>
      )}
      
      {/* Éléments du breadcrumb */}
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        
        return (
          <motion.div
            key={`${item.view}-${item.timestamp}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 + index * 0.1 }}
            className="flex items-center"
          >
            <ChevronRight className="h-3 w-3 text-muted-foreground mx-1" />
            
            {isLast ? (
              <span className="text-foreground font-medium px-2 py-1 rounded bg-muted/50">
                {item.title}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(item)}
                className="h-8 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {item.title}
              </Button>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}