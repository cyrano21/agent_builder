"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  CheckCircle, 
  Crown, 
  Zap, 
  Database, 
  Cloud, 
  CreditCard, 
  Download,
  FileText,
  TrendingUp,
  Settings,
  AlertCircle,
  Loader2,
  Plus
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  maxProjects: number;
  maxTokens: number;
  maxStorage: number; // in GB
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Gratuit",
    price: "€0",
    period: "/mois",
    description: "Parfait pour tester la plateforme",
    features: [
      "3 projets par mois",
      "50,000 tokens IA",
      "1 GB de stockage",
      "Support communautaire",
      "Export basique"
    ],
    maxProjects: 3,
    maxTokens: 50000,
    maxStorage: 1
  },
  {
    id: "pro",
    name: "Professionnel",
    price: "€49",
    period: "/mois",
    description: "Pour les développeurs et petites équipes",
    features: [
      "Projets illimités",
      "200,000 tokens IA",
      "10 GB de stockage",
      "Support prioritaire",
      "Export avancé",
      "API accès",
      "Intégrations premium"
    ],
    popular: true,
    maxProjects: -1,
    maxTokens: 200000,
    maxStorage: 10
  },
  {
    id: "enterprise",
    name: "Entreprise",
    price: "Sur mesure",
    period: "",
    description: "Pour les grandes organisations",
    features: [
      "Tout ce qui est inclus dans Pro",
      "Tokens IA illimités",
      "Stockage illimité",
      "Support dédié 24/7",
      "SLA garanti",
      "On-premise option",
      "Formation personnalisée",
      "Account manager dédié"
    ],
    maxProjects: -1,
    maxTokens: -1,
    maxStorage: -1
  }
];

interface UsageData {
  projectsGenerated: number;
  tokensUsed: number;
  storageUsed: number; // in bytes
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  downloadUrl: string;
}

export default function BillingPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");

  // Mock usage data
  const usage: UsageData = {
    projectsGenerated: 2,
    tokensUsed: 45230,
    storageUsed: 2342145432 // ~2.3 GB
  };

  // Mock invoices
  const invoices: Invoice[] = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: "€49.00",
      status: "paid",
      downloadUrl: "/invoices/INV-2024-001.pdf"
    },
    {
      id: "INV-2024-002",
      date: "2024-02-15",
      amount: "€49.00",
      status: "paid",
      downloadUrl: "/invoices/INV-2024-002.pdf"
    },
    {
      id: "INV-2024-003",
      date: "2024-03-15",
      amount: "€49.00",
      status: "pending",
      downloadUrl: "/invoices/INV-2024-003.pdf"
    }
  ];

  const getCurrentPlanLimits = () => {
    return subscriptionPlans.find(plan => plan.id === currentPlan) || subscriptionPlans[0];
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1);
  };

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentPlan(planId);
      
      // Show success message
      alert(`Mise à niveau vers le plan ${subscriptionPlans.find(p => p.id === planId)?.name} réussie !`);
    } catch (error) {
      alert("Erreur lors de la mise à niveau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler votre abonnement ?")) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPlan("free");
      alert("Abonnement annulé avec succès.");
    } catch (error) {
      alert("Erreur lors de l'annulation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Échouée</Badge>;
    }
  };

  const currentLimits = getCurrentPlanLimits();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Agent Builder Enterprise v2</span>
              </div>
              <nav className="hidden md:flex space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                  Accueil
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/?view=dashboard')}>
                  Tableau de bord
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/projects')}>
                  Projets
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
                  Paramètres
                </Button>
                <Button variant="ghost" size="sm">Facturation</Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Facturation & Abonnement</h1>
            <p className="text-muted-foreground">
              Gérez votre abonnement et suivez votre utilisation
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="plans">Plans & Abonnement</TabsTrigger>
              <TabsTrigger value="usage">Utilisation</TabsTrigger>
              <TabsTrigger value="invoices">Factures</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              {/* Current Plan Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Votre abonnement actuel
                  </CardTitle>
                  <CardDescription>
                    Vous êtes actuellement sur le plan <span className="font-semibold">{currentLimits.name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{currentLimits.price}<span className="text-base font-normal text-muted-foreground">{currentLimits.period}</span></div>
                      <p className="text-sm text-muted-foreground mt-1">{currentLimits.description}</p>
                    </div>
                    {currentPlan !== "free" && (
                      <Button 
                        variant="outline" 
                        onClick={handleCancelSubscription}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Annuler l'abonnement
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Available Plans */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Choisissez votre plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            <Crown className="w-3 h-3 mr-1" />
                            Populaire
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-3xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? "default" : "outline"}
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isLoading || currentPlan === plan.id}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : currentPlan === plan.id ? (
                            "Plan actuel"
                          ) : (
                            "Mettre à niveau"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usage Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Utilisation ce mois
                    </CardTitle>
                    <CardDescription>
                      Suivez votre consommation par rapport à votre plan actuel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Projets générés
                          </span>
                          <span>{usage.projectsGenerated} / {currentLimits.maxProjects === -1 ? '∞' : currentLimits.maxProjects}</span>
                        </div>
                        <Progress 
                          value={getUsagePercentage(usage.projectsGenerated, currentLimits.maxProjects)} 
                          className="w-full" 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Tokens IA utilisés
                          </span>
                          <span>{usage.tokensUsed.toLocaleString()} / {currentLimits.maxTokens === -1 ? '∞' : currentLimits.maxTokens.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={getUsagePercentage(usage.tokensUsed, currentLimits.maxTokens)} 
                          className="w-full" 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            Stockage utilisé
                          </span>
                          <span>{formatStorage(usage.storageUsed)} GB / {currentLimits.maxStorage === -1 ? '∞' : currentLimits.maxStorage} GB</span>
                        </div>
                        <Progress 
                          value={getUsagePercentage(usage.storageUsed, currentLimits.maxStorage * 1024 * 1024 * 1024)} 
                          className="w-full" 
                        />
                      </div>
                    </div>

                    {currentPlan === "free" && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Vous approchez de vos limites. Pensez à mettre à niveau vers le plan Pro pour continuer à utiliser toutes les fonctionnalités.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Usage History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      Historique d'utilisation
                    </CardTitle>
                    <CardDescription>
                      Vos 6 derniers mois d'utilisation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { month: "Mars 2024", projects: 2, tokens: 45230, storage: 2.3 },
                        { month: "Février 2024", projects: 3, tokens: 52100, storage: 2.8 },
                        { month: "Janvier 2024", projects: 1, tokens: 23400, storage: 1.2 },
                        { month: "Décembre 2023", projects: 4, tokens: 67800, storage: 3.5 },
                        { month: "Novembre 2023", projects: 2, tokens: 41200, storage: 2.1 },
                        { month: "Octobre 2023", projects: 1, tokens: 18900, storage: 0.9 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{item.month}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.projects} projets • {item.tokens.toLocaleString()} tokens • {item.storage} GB
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {currentPlan === "free" ? "Gratuit" : "€49.00"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Factures
                  </CardTitle>
                  <CardDescription>
                    Historique de vos factures et paiements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{invoice.id}</div>
                            <div className="text-sm text-muted-foreground">{invoice.date}</div>
                          </div>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">{invoice.amount}</div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.status === "paid" ? "Payée" : invoice.status === "pending" ? "En attente" : "Échouée"}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Méthode de paiement
                  </CardTitle>
                  <CardDescription>
                    Gérez vos cartes et informations de paiement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">•••• •••• •••• 4242</div>
                          <div className="text-sm text-muted-foreground">Expire 12/25</div>
                        </div>
                        <Badge variant="outline">Par défaut</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une méthode de paiement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}