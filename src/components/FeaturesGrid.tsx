"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Code, Shield, Cloud, Users, Zap } from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface FeaturesGridProps {
  features?: Feature[];
}

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  const defaultFeatures: Feature[] = [
    {
      icon: Brain,
      title: "IA Avancée",
      description: "Utilise les derniers modèles LLM pour générer du code de qualité professionnelle",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Code,
      title: "Code Complet",
      description: "Génère frontend, backend, API et base de données avec architecture moderne",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Sécurité Intégrée",
      description: "Best practices de sécurité, authentification et protection des données incluses",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Cloud,
      title: "Déploiement Auto",
      description: "Configuration DevOps complète avec CI/CD et déploiement cloud",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Travaillez en équipe avec gestion des utilisateurs et permissions",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Applications optimisées avec monitoring et scaling automatique",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const featuresToUse = features || defaultFeatures;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Tout ce dont vous avez besoin
            <br />
            <span className="text-primary">en une seule plateforme</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De l'idée au produit final, notre IA s'occupe de tout le processus de développement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresToUse.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const { icon: Icon, title, description, color } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="group"
    >
      <Card className="h-full border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-8 text-center">
          <motion.div
            className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-white`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// CTA Section Component
interface CTASectionProps {
  onStartFree: () => void;
  onViewDemo: () => void;
}

export function CTASection({ onStartFree, onViewDemo }: CTASectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-4">
            Prêt à transformer vos idées ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers de développeurs et entreprises qui utilisent Agent Builder Enterprise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 transition-all duration-200"
              onClick={onStartFree}
            >
              Commencer Gratuitement
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary transition-all duration-200"
              onClick={onViewDemo}
            >
              Voir une Démo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}