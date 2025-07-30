"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, Download } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useNavigationHistory } from "@/hooks/use-navigation-history";

interface HeaderProps {
  currentView: "landing" | "dashboard" | "settings";
  onNavigate: (view: "landing" | "dashboard" | "settings", path?: string) => void;
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { canGoBack, goBack, getBreadcrumbs } = useNavigationHistory();
  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="relative border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="h-[3rem] flex items-center border-b bg-muted/20">
          <Breadcrumb
            items={breadcrumbs}
            canGoBack={canGoBack}
            onNavigate={(item) => onNavigate(item.view, item.path)}
            onGoBack={goBack}
            maxItems={4}
          />
        </div>
        
        <div className="flex h-[4.5rem] items-center justify-between">
          {/* Logo et titre */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex-shrink-0"
            >
              <Brain className="h-[2rem] w-[2rem] text-primary" />
            </motion.div>
            <span className="text-[1.25rem] sm:text-[1.5rem] font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Agent Builder
              <span className="block sm:inline text-[0.875rem] sm:text-[1rem] sm:ml-1 text-muted-foreground font-normal">
                Enterprise v2
              </span>
            </span>
          </motion.div>
          
          {/* Navigation desktop */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Navigation currentView={currentView} onNavigate={onNavigate} />
            
            {/* Avatar utilisateur */}
            <div className="w-[2rem] h-[2rem] bg-primary rounded-full flex items-center justify-center text-primary-foreground text-[0.875rem] font-semibold flex-shrink-0">
              <User className="h-[1rem] w-[1rem]" />
            </div>
          </motion.div>

          {/* Bouton menu mobile */}
          <motion.div 
            className="md:hidden flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-[2.5rem] h-[2.5rem] p-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-[1.25rem] w-[1.25rem]" />
              ) : (
                <Menu className="h-[1.25rem] w-[1.25rem]" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Menu mobile */}
        <motion.div
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 border-t">
            <MobileNavigation 
              currentView={currentView} 
              onNavigate={(view, path) => {
                onNavigate(view, path);
                setIsMobileMenuOpen(false);
              }} 
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="w-[2rem] h-[2rem] bg-primary rounded-full flex items-center justify-center text-primary-foreground text-[0.875rem] font-semibold">
                  <User className="h-[1rem] w-[1rem]" />
                </div>
                <div>
                  <p className="text-[0.875rem] font-medium">John Doe</p>
                  <p className="text-[0.75rem] text-muted-foreground">john@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

interface NavigationProps {
  currentView: "landing" | "dashboard" | "settings";
  onNavigate: (view: "landing" | "dashboard" | "settings", path?: string) => void;
}

function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { label: "Accueil", view: "landing" as const, showOnLanding: false },
    { label: "Tableau de bord", view: "dashboard" as const, path: "/dashboard", showOnLanding: true },
    { label: "Projets", view: "dashboard" as const, path: "/projects", showOnLanding: true },
    { label: "Télécharger", view: "landing" as const, path: "/download", showOnLanding: true, isDownload: true },
    { label: "Paramètres", view: "settings" as const, showOnLanding: true },
    { label: "Facturation", view: "settings" as const, path: "/billing", showOnLanding: true },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.path) {
      // Pour les chemins spécifiques, naviguer directement
      window.location.href = item.path;
    } else {
      // Pour les vues générales, utiliser la fonction de navigation
      onNavigate(item.view);
    }
  };

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        // Ne pas afficher "Accueil" sur la page d'accueil
        if (currentView === "landing" && !item.showOnLanding) {
          return null;
        }

        const isActive = currentView === item.view;

        return (
          <Button 
            key={item.label}
            variant="ghost"
            className={`
              relative px-[1rem] py-[0.5rem] text-[0.875rem] font-medium
              hover:bg-primary/10 hover:text-primary 
              transition-all duration-200 rounded-md
              ${isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
              }
              ${item.isDownload ? 'text-green-600 hover:text-green-700' : ''}
            `}
            onClick={() => handleNavigation(item)}
          >
            {item.isDownload ? (
              <Download className="h-[1rem] w-[1rem] mr-[0.5rem]" />
            ) : null}
            {item.label}
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[0.125rem] bg-primary rounded-t"
                layoutId="activeNav"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Button>
        );
      })}
    </nav>
  );
}

interface MobileNavigationProps {
  currentView: "landing" | "dashboard" | "settings";
  onNavigate: (view: "landing" | "dashboard" | "settings", path?: string) => void;
}

function MobileNavigation({ currentView, onNavigate }: MobileNavigationProps) {
  const navItems = [
    { label: "Accueil", view: "landing" as const, showOnLanding: false, icon: "🏠" },
    { label: "Tableau de bord", view: "dashboard" as const, path: "/dashboard", showOnLanding: true, icon: "📊" },
    { label: "Projets", view: "dashboard" as const, path: "/projects", showOnLanding: true, icon: "📁" },
    { label: "Télécharger", view: "landing" as const, path: "/download", showOnLanding: true, icon: "⬇️" },
    { label: "Paramètres", view: "settings" as const, showOnLanding: true, icon: "⚙️" },
    { label: "Facturation", view: "settings" as const, path: "/billing", showOnLanding: true, icon: "💳" },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.path) {
      window.location.href = item.path;
    } else {
      onNavigate(item.view);
    }
  };

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        // Ne pas afficher "Accueil" sur la page d'accueil
        if (currentView === "landing" && !item.showOnLanding) {
          return null;
        }

        const isActive = currentView === item.view;

        return (
          <Button
            key={item.label}
            variant="ghost"
            className={`
              w-full justify-start px-[1rem] py-[0.75rem] text-[0.875rem] font-medium
              hover:bg-primary/10 hover:text-primary 
              transition-all duration-200 rounded-md
              ${isActive 
                ? 'text-primary bg-primary/10 border-l-4 border-l-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
              ${item.label === "Télécharger" ? 'text-green-600 hover:text-green-700' : ''}
            `}
            onClick={() => handleNavigation(item)}
          >
            <span className="mr-[0.75rem] text-[1rem]">{item.icon}</span>
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}