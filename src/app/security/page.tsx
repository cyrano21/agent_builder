"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Lock, Server, Eye, ArrowLeft } from "lucide-react";

export default function SecurityPage() {
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
            <h1 className="text-4xl font-bold mb-4">Sécurité</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous prenons la sécurité de vos données très au sérieux. Voici comment nous protégeons vos informations.
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Chiffrement des données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Toutes vos données sont chiffrées en transit et au repos :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Chiffrement TLS 1.3 pour toutes les communications</li>
                    <li>Chiffrement AES-256 pour les données stockées</li>
                    <li>Chiffrement de bout en bout pour les communications sensibles</li>
                    <li>Gestion sécurisée des clés de chiffrement</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Authentification et contrôle d'accès
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous utilisons des méthodes d'authentification robustes :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Authentification multifacteur (MFA) disponible</li>
                    <li>Mots de passe forts avec politique de sécurité</li>
                    <li>Sessions sécurisées avec expiration automatique</li>
                    <li>Contrôle d'accès basé sur les rôles (RBAC)</li>
                    <li>Journalisation complète des accès et actions</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Infrastructure sécurisée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Notre infrastructure est conçue pour la sécurité :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Serveurs hébergés dans des centres de données certifiés ISO 27001</li>
                    <li>Pare-feu next-generation et systèmes de détection d'intrusion</li>
                    <li>Sauvegardes chiffrées et géo-redondantes</li>
                    <li>Mise à jour régulière des systèmes et correctifs de sécurité</li>
                    <li>Surveillance 24/7 avec réponse aux incidents</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Surveillance et audits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous surveillons en continu notre sécurité :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Audits de sécurité tiers réguliers</li>
                    <li>Tests de pénétration annuels</li>
                    <li>Surveillance des menaces en temps réel</li>
                    <li>Programme de bug bounty pour les chercheurs en sécurité</li>
                    <li>Formation continue de l'équipe sur les meilleures pratiques</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Conformité réglementaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous respectons les principales régulations de protection des données :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>RGPD (Règlement Général sur la Protection des Données)</li>
                    <li>CCPA (California Consumer Privacy Act)</li>
                    <li>Loi Informatique et Libertés</li>
                    <li>Normes ISO 27001 et SOC 2</li>
                    <li>Conformité avec les régulations sectorielles applicables</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Signaler un problème de sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Si vous découvrez une vulnérabilité de sécurité, nous vous encourageons à nous la signaler 
                    de manière responsable. Contactez-nous à security@agentbuilder.ai. Nous nous engageons à 
                    répondre rapidement à tous les rapports légitimes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}