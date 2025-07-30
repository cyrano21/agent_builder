"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Target, Award, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Agent Builder Enterprise v2</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">À propos de nous</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous sommes passionnés par l'innovation et déterminés à transformer la façon dont les idées deviennent des produits réels.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Notre mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  Démocratiser l'accès à l'intelligence artificielle pour permettre à chaque entrepreneur, 
                  développeur et créatif de transformer ses idées en produits complets et fonctionnels. 
                  Nous croyons que la technologie devrait être un accélérateur d'innovation, pas une barrière.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Nos valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nous repoussons constamment les limites de ce qui est possible avec l'IA et l'automatisation.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Communauté
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nous construisons pour et avec notre communauté d'utilisateurs passionnés.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nous nous engageons à fournir la meilleure qualité et expérience utilisateur possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Notre histoire</CardTitle>
                <CardDescription>
                  Le parcours qui nous a menés ici
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Fondé en 2023 par une équipe d'experts en intelligence artificielle et développement logiciel, 
                  Agent Builder Enterprise est né d'une constatation simple : transformer une idée en produit 
                  fonctionnel reste un processus complexe et coûteux pour beaucoup d'entrepreneurs et développeurs.
                </p>
                <p className="text-muted-foreground">
                  Nous avons décidé de changer cela en créant une plateforme qui combine la puissance de 
                  l'IA générative avec une expertise technique approfondie pour automatiser et accélérer 
                  le cycle de développement complet.
                </p>
                <p className="text-muted-foreground">
                  Aujourd'hui, nous aidons des milliers de créateurs à donner vie à leurs idées plus 
                  rapidement que jamais, tout en maintenant les standards les plus élevés de qualité et 
                  d'innovation.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notre équipe</CardTitle>
                <CardDescription>
                  Les personnes derrière Agent Builder Enterprise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Experts en IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Spécialistes en machine learning et IA générative
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Développeurs seniors</h3>
                    <p className="text-sm text-muted-foreground">
                      Experts en architecture logicielle et développement
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Designers UX/UI</h3>
                    <p className="text-sm text-muted-foreground">
                      Créateurs d'expériences utilisateur exceptionnelles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}