"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold mb-4">Conditions d'utilisation</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Veuillez lire attentivement ces conditions avant d'utiliser notre service.
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
                    <FileText className="h-5 w-5 text-primary" />
                    Acceptation des conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    En accédant à ou en utilisant Agent Builder Enterprise v2, vous acceptez d'être lié par ces 
                    conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                  </p>
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
                  <CardTitle>Description du service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Agent Builder Enterprise v2 est une plateforme logicielle qui utilise l'intelligence artificielle 
                    pour aider les utilisateurs à générer des plans de projet, de l'architecture, des designs, 
                    du code backend et d'autres livrables techniques basés sur leurs idées et descriptions.
                  </p>
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
                  <CardTitle>Obligations de l'utilisateur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    En utilisant notre service, vous vous engagez à :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fournir des informations exactes et complètes</li>
                    <li>Ne pas utiliser le service à des fins illégales ou frauduleuses</li>
                    <li>Respecter les droits de propriété intellectuelle des tiers</li>
                    <li>Ne pas tenter de compromettre la sécurité du service</li>
                    <li>Ne pas partager votre compte avec des tiers non autorisés</li>
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
                  <CardTitle>Propriété intellectuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Vous conservez les droits de propriété intellectuelle sur le contenu que vous créez en utilisant 
                    notre service. Cependant, vous nous accordez une licence mondiale, non exclusive, transférable 
                    et sous-licenciable pour utiliser, héberger, reproduire, modifier et distribuer votre contenu 
                    dans le cadre de la fourniture de nos services.
                  </p>
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
                  <CardTitle>Limitation de responsabilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Agent Builder Enterprise v2 est fourni "en l'état", sans garantie d'aucune sorte. Nous ne 
                    garantissons pas que le service sera ininterrompu, précis ou exempt d'erreurs. En aucun cas, 
                    notre responsabilité ne pourra excéder le montant que vous avez payé pour le service au cours 
                    des 12 derniers mois.
                  </p>
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
                  <CardTitle>Résiliation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous nous réservons le droit de résilier ou suspendre votre compte à tout moment, pour quelque 
                    raison que ce soit, y compris mais sans s'y limiter, en cas de violation de ces conditions 
                    d'utilisation ou d'activité suspecte.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les 
                    modifications prendront effet dès leur publication sur le site. Il est de votre responsabilité 
                    de consulter régulièrement ces conditions.
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