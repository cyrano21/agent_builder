"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, Code, ArrowLeft } from "lucide-react";

export default function LicensePage() {
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Licence MIT</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Agent Builder Enterprise v2 est sous licence MIT. Voici le texte complet de la licence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Licence MIT
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="mb-4">
                  Copyright (c) 2024 Agent Builder Enterprise
                </p>
                
                <p className="mb-4">
                  Permission est accordée, gratuitement, à toute personne obtenant une copie de ce logiciel et 
                  des fichiers de documentation associés (le "Logiciel"), de traiter le Logiciel sans restriction, 
                  y compris, sans s'y limiter, les droits d'utilisation, de copie, de modification, de fusion, 
                  de publication, de distribution, de sous-licence et/ou de vente de copies du Logiciel, 
                  et d'autoriser les personnes à qui le Logiciel est fourni à le faire, sous réserve des 
                  conditions suivantes :
                </p>
                
                <p className="mb-4">
                  L'avis de copyright ci-dessus et cet avis de permission doivent être inclus dans toutes 
                  les copies ou parties substantielles du Logiciel.
                </p>
                
                <p className="mb-4">
                  LE LOGICIEL EST FOURNI "TEL QUEL", SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU IMPLICITE, 
                  Y COMPRIS MAIS SANS S'Y LIMITER LES GARANTIES DE QUALITÉ MARCHANDE, D'ADÉQUATION À UN USAGE 
                  PARTICULIER ET D'ABSENCE DE CONTREFAÇON. EN AUCUN CAS LES AUTEURS OU LES TITULAIRES 
                  DE DROIT D'AUTEUR NE POURRONT ÊTRE TENUS RESPONSABLES DE QUELQUE RÉCLAMATION, DOMMAGE 
                  OU AUTRE RESPONSABILITÉ, QUE CE SOIT DANS LE CADRE D'UNE ACTION CONTRACTUELLE, 
                  DÉLICTUELLE OU AUTRE, DÉCOULANT DE, EN RELATION AVEC OU EN CONNEXION AVEC LE LOGICIEL, 
                  L'UTILISATION DU LOGICIEL OU D'AUTRES TRANSACTIONS AVEC LE LOGICIEL.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Composants tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Agent Builder Enterprise v2 utilise des composants open source tiers qui sont sous leurs 
                  propres licences respectives. Les licences de ces composants sont compatibles avec la licence MIT.
                </p>
                <p>
                  Les principaux composants utilisés incluent :
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Next.js - Licence MIT</li>
                  <li>React - Licence MIT</li>
                  <li>TypeScript - Licence Apache 2.0</li>
                  <li>Tailwind CSS - Licence MIT</li>
                  <li>Framer Motion - Licence MIT</li>
                  <li>Lucide React - Licence MIT</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Nous accueillons favorablement les contributions à la communauté. En soumettant une contribution, 
                  vous acceptez de la placer sous la même licence que le projet (MIT) et vous garantissez que 
                  vous avez le droit de le faire.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}