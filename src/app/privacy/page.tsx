"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold mb-4">Politique de confidentialité</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous nous engageons à protéger vos données personnelles et à garantir votre confidentialité.
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
                    Collecte des données
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Nous collectons uniquement les données nécessaires au bon fonctionnement de notre service :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Informations de compte (nom, email, mot de passe)</li>
                    <li>Données de projets et idées que vous créez</li>
                    <li>Données d'utilisation et de performance</li>
                    <li>Informations de paiement pour les abonnements</li>
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
                  <CardTitle>Utilisation des données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Vos données sont utilisées pour :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fournir et améliorer nos services</li>
                    <li>Générer des projets et livrables selon vos demandes</li>
                    <li>Communiquer avec vous concernant votre compte</li>
                    <li>Assurer la sécurité et la prévention des fraudes</li>
                    <li>Conformité avec les obligations légales</li>
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
                  <CardTitle>Protection des données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Chiffrement des données en transit et au repos</li>
                    <li>Contrôle d'accès strict et authentification forte</li>
                    <li>Audits de sécurité réguliers</li>
                    <li>Formation du personnel sur la protection des données</li>
                    <li>Conformité RGPD et régulations internationales</li>
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
                  <CardTitle>Vos droits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Conformément au RGPD, vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Droit d'accès à vos données personnelles</li>
                    <li>Droit de rectification des données inexactes</li>
                    <li>Droit à la suppression de vos données</li>
                    <li>Droit à la limitation du traitement</li>
                    <li>Droit à la portabilité des données</li>
                    <li>Droit d'opposition au traitement</li>
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
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits, 
                    vous pouvez nous contacter à : privacy@agentbuilder.ai
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