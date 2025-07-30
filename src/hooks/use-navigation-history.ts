"use client";

import { useState, useEffect, useCallback } from 'react';

export interface NavigationHistoryItem {
  view: "landing" | "dashboard" | "settings";
  path?: string;
  title: string;
  timestamp: number;
}

export interface UseNavigationHistoryReturn {
  history: NavigationHistoryItem[];
  currentView: "landing" | "dashboard" | "settings";
  currentPath?: string;
  canGoBack: boolean;
  navigateTo: (view: "landing" | "dashboard" | "settings", path?: string, title?: string) => void;
  goBack: () => void;
  clearHistory: () => void;
  getBreadcrumbs: () => NavigationHistoryItem[];
}

export function useNavigationHistory(): UseNavigationHistoryReturn {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);
  const [currentView, setCurrentView] = useState<"landing" | "dashboard" | "settings">("landing");
  const [currentPath, setCurrentPath] = useState<string | undefined>();

  // Initialiser la vue depuis l'URL au chargement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const path = window.location.pathname;
      
      if (view === 'dashboard' || view === 'settings') {
        const initialItem: NavigationHistoryItem = {
          view: view as "landing" | "dashboard" | "settings",
          path: path !== '/' ? path : undefined,
          title: getViewTitle(view as "landing" | "dashboard" | "settings"),
          timestamp: Date.now()
        };
        setHistory([initialItem]);
        setCurrentView(view as "landing" | "dashboard" | "settings");
        setCurrentPath(path !== '/' ? path : undefined);
      } else {
        const initialItem: NavigationHistoryItem = {
          view: "landing",
          path: path !== '/' ? path : undefined,
          title: "Accueil",
          timestamp: Date.now()
        };
        setHistory([initialItem]);
      }
    }
  }, []);

  // Gérer l'événement popstate (retour en arrière du navigateur)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (history.length > 1) {
        // Retirer l'élément actuel et revenir au précédent
        const newHistory = history.slice(0, -1);
        const previousItem = newHistory[newHistory.length - 1];
        
        setHistory(newHistory);
        setCurrentView(previousItem.view);
        setCurrentPath(previousItem.path);
        
        // Mettre à jour l'URL
        if (typeof window !== 'undefined') {
          if (previousItem.view === "landing") {
            window.history.pushState({}, '', '/');
          } else {
            window.history.pushState({}, '', `?view=${previousItem.view}`);
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [history]);

  const navigateTo = useCallback((
    view: "landing" | "dashboard" | "settings", 
    path?: string, 
    title?: string
  ) => {
    const newItem: NavigationHistoryItem = {
      view,
      path,
      title: title || getViewTitle(view),
      timestamp: Date.now()
    };

    // Éviter les doublons consécutifs
    const lastItem = history[history.length - 1];
    if (lastItem && lastItem.view === view && lastItem.path === path) {
      return;
    }

    setHistory(prev => [...prev, newItem]);
    setCurrentView(view);
    setCurrentPath(path);

    // Mettre à jour l'URL et l'historique du navigateur
    if (typeof window !== 'undefined') {
      if (view === "landing") {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', `?view=${view}`);
      }
      
      if (path) {
        window.location.href = path;
      }
    }
  }, [history]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousItem = newHistory[newHistory.length - 1];
      
      setHistory(newHistory);
      setCurrentView(previousItem.view);
      setCurrentPath(previousItem.path);
      
      // Mettre à jour l'URL
      if (typeof window !== 'undefined') {
        if (previousItem.view === "landing") {
          window.history.pushState({}, '', '/');
        } else {
          window.history.pushState({}, '', `?view=${previousItem.view}`);
        }
        
        if (previousItem.path) {
          window.location.href = previousItem.path;
        }
      }
    }
  }, [history]);

  const clearHistory = useCallback(() => {
    const currentItem: NavigationHistoryItem = {
      view: currentView,
      path: currentPath,
      title: getViewTitle(currentView),
      timestamp: Date.now()
    };
    setHistory([currentItem]);
  }, [currentView, currentPath]);

  const getBreadcrumbs = useCallback(() => {
    // Retourner les 5 derniers éléments pour les breadcrumbs
    return history.slice(-5);
  }, [history]);

  const canGoBack = history.length > 1;

  return {
    history,
    currentView,
    currentPath,
    canGoBack,
    navigateTo,
    goBack,
    clearHistory,
    getBreadcrumbs
  };
}

function getViewTitle(view: "landing" | "dashboard" | "settings"): string {
  switch (view) {
    case "landing":
      return "Accueil";
    case "dashboard":
      return "Tableau de bord";
    case "settings":
      return "Paramètres";
    default:
      return view;
  }
}