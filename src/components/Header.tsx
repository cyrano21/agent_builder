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
        <div className="h-10 sm:h-12 flex items-center border-b bg-muted/20 overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <Breadcrumb
              items={breadcrumbs}
              canGoBack={canGoBack}
              onNavigate={(item) => onNavigate(item.view, item.path)}
              onGoBack={goBack}
              maxItems={3}
            />
          </div>
        </div>
        
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo et titre */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1 sm:flex-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex-shrink-0"
            >
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </motion.div>
            <div className="min-w-0 flex-1 sm:flex-none">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight block truncate">
                Agent Builder
              </span>
              <span className="hidden xs:block text-xs sm:text-sm lg:text-base text-muted-foreground font-normal truncate">
                Enterprise v2
              </span>
            </div>
          </motion.div>
          
          {/* Navigation desktop */}
          <motion.div 
            className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Navigation currentView={currentView} onNavigate={onNavigate} />
            
            {/* Avatar utilisateur */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0 ml-2">
              <User className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Navigation tablette */}
          <motion.div 
            className="hidden md:flex lg:hidden items-center space-x-1 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabletNavigation currentView={currentView} onNavigate={onNavigate} />
            
            {/* Avatar utilisateur */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0 ml-2">
              <User className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Bouton menu mobile */}
          <motion.div 
            className="md:hidden flex items-center space-x-2 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Avatar utilisateur mobile */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 p-0 flex-shrink-0"
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Menu mobile */}
        <motion.div
          className={`md:hidden overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 border-t bg-background/95 backdrop-blur-sm">
            <MobileNavigation 
              currentView={currentView} 
              onNavigate={(view, path) => {
                onNavigate(view, path);
                setIsMobileMenuOpen(false);
              }} 
            />
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-3 px-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">john@example.com</p>
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
    { label: "Télécharger (SQLite)", view: "landing" as const, path: "/download", showOnLanding: true, isDownload: true },
    { label: "Télécharger (MongoDB)", view: "landing" as const, path: "/download-mongodb", showOnLanding: true, isMongoDB: true },
    { label: "Paramètres", view: "settings" as const, showOnLanding: true },
    { label: "Facturation", view: "settings" as const, path: "/billing", showOnLanding: true },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.path) {
      window.location.href = item.path;
    } else {
      onNavigate(item.view);
    }
  };

  return (
    <nav className="flex items-center space-x-1 xl:space-x-2">
      {navItems.map((item) => {
        if (currentView === "landing" && !item.showOnLanding) {
          return null;
        }

        const isActive = currentView === item.view;

        return (
          <Button 
            key={item.label}
            variant="ghost"
            size="sm"
            className={`
              relative px-2 xl:px-4 py-2 text-xs xl:text-sm font-medium whitespace-nowrap
              hover:bg-primary/10 hover:text-primary 
              transition-all duration-200 rounded-md
              ${isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
              }
              ${item.isDownload ? 'text-blue-600 hover:text-blue-700' : ''}
              ${item.isMongoDB ? 'text-green-600 hover:text-green-700' : ''}
            `}
            onClick={() => handleNavigation(item)}
          >
            {(item.isDownload || item.isMongoDB) && (
              <Download className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
            )}
            <span className="hidden xl:inline">{item.label}</span>
            <span className="xl:hidden">
              {item.label === "Tableau de bord" ? "Dashboard" :
               item.label === "Projets" ? "Projets" :
               item.label === "Télécharger (SQLite)" ? "SQLite" :
               item.label === "Télécharger (MongoDB)" ? "MongoDB" :
               item.label === "Paramètres" ? "Config" :
               item.label === "Facturation" ? "Billing" : item.label}
            </span>
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t"
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

// Navigation pour tablettes
function TabletNavigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { label: "Dashboard", view: "dashboard" as const, path: "/dashboard", showOnLanding: true, icon: "📊" },
    { label: "Projets", view: "dashboard" as const, path: "/projects", showOnLanding: true, icon: "📁" },
    { label: "SQLite", view: "landing" as const, path: "/download", showOnLanding: true, icon: "⬇️" },
    { label: "MongoDB", view: "landing" as const, path: "/download-mongodb", showOnLanding: true, icon: "🍃" },
    { label: "Config", view: "settings" as const, showOnLanding: true, icon: "⚙️" },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.path) {
      window.location.href = item.path;
    } else {
      onNavigate(item.view);
    }
  };

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        if (currentView === "landing" && !item.showOnLanding) {
          return null;
        }

        const isActive = currentView === item.view;

        return (
          <Button 
            key={item.label}
            variant="ghost"
            size="sm"
            className={`
              relative px-2 py-2 text-xs font-medium whitespace-nowrap flex items-center
              hover:bg-primary/10 hover:text-primary 
              transition-all duration-200 rounded-md
              ${isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
            onClick={() => handleNavigation(item)}
          >
            <span className="mr-1 text-sm">{item.icon}</span>
            {item.label}
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t"
                layoutId="activeNavTablet"
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
    { label: "Télécharger (SQLite)", view: "landing" as const, path: "/download", showOnLanding: true, icon: "⬇️" },
    { label: "Télécharger (MongoDB)", view: "landing" as const, path: "/download-mongodb", showOnLanding: true, icon: "🍃" },
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
    <nav className="space-y-1 px-2">
      {navItems.map((item) => {
        if (currentView === "landing" && !item.showOnLanding) {
          return null;
        }

        const isActive = currentView === item.view;

        return (
          <Button
            key={item.label}
            variant="ghost"
            className={`
              w-full justify-start px-4 py-3 text-sm font-medium min-h-12
              hover:bg-primary/10 hover:text-primary 
              transition-all duration-200 rounded-lg
              ${isActive 
                ? 'text-primary bg-primary/10 border-l-4 border-l-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
              ${item.label === "Télécharger (SQLite)" ? 'text-blue-600 hover:text-blue-700' : ''}
              ${item.label === "Télécharger (MongoDB)" ? 'text-green-600 hover:text-green-700' : ''}
            `}
            onClick={() => handleNavigation(item)}
          >
            <span className="mr-3 text-lg flex-shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}