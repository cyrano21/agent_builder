"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Page non trouvée</CardTitle>
            <CardDescription>
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => window.location.href = '/'}
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Page précédente
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Vous cherchiez peut-être :
              </p>
              <div className="space-y-1 text-sm">
                <Link href="/dashboard" className="block text-primary hover:underline">
                  Tableau de bord
                </Link>
                <Link href="/projects" className="block text-primary hover:underline">
                  Projets
                </Link>
                <Link href="/settings" className="block text-primary hover:underline">
                  Paramètres
                </Link>
                <Link href="/billing" className="block text-primary hover:underline">
                  Facturation
                </Link>
                <Link href="/auth" className="block text-primary hover:underline">
                  Connexion / Inscription
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}