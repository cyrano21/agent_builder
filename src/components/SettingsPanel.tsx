"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Brain, Cloud, BarChart3, Shield, Database, Plus } from "lucide-react";

interface SettingsPanelProps {
  onNavigate: (view: "landing" | "dashboard" | "settings", path?: string) => void;
}

export default function SettingsPanel({ onNavigate }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState("Général");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
            <p className="text-muted-foreground">Gérez votre compte et les préférences de l'application</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <SettingsMainContent activeSection={activeSection} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const menuItems = [
    { icon: Settings, label: "Général" },
    { icon: Brain, label: "AI & LLM" },
    { icon: Cloud, label: "Intégrations" },
    { icon: BarChart3, label: "Notifications" },
    { icon: Shield, label: "Sécurité" },
    { icon: Database, label: "Facturation" },
  ];

  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {menuItems.map((item) => (
            <motion.div key={item.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant={activeSection === item.label ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => onSectionChange(item.label)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

interface SettingsMainContentProps {
  activeSection: string;
}

function SettingsMainContent({ activeSection }: SettingsMainContentProps) {
  return (
    <div className="lg:col-span-3 space-y-6">
      {activeSection === "Général" && <ProfileSettings />}
      {activeSection === "AI & LLM" && <AILLMSettings />}
      {activeSection === "Intégrations" && <IntegrationSettings />}
      {activeSection === "Notifications" && <NotificationSettings />}
      {activeSection === "Sécurité" && <SecuritySettings />}
      {activeSection === "Facturation" && <BillingSettings />}
    </div>
  );
}

function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Informations de votre compte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue="john.doe@example.com" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <Textarea 
            placeholder="Décrivez-vous..." 
            defaultValue="Développeur passionné par l'IA et l'innovation"
          />
        </div>
        <div className="flex justify-end">
          <Button>Enregistrer les changements</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AILLMSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration AI & LLM</CardTitle>
        <CardDescription>Personnalisez les modèles d'IA et leurs paramètres</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ModelSelector />
        <ParameterSlider 
          label="Température"
          description="Contrôle la créativité de l'IA (0.0 - 1.0)"
          value="0.7"
          min={0}
          max={1}
          step={0.1}
        />
        <ParameterSlider 
          label="Longueur maximale"
          description="Nombre maximum de tokens par réponse"
          value="4000"
          min={1000}
          max={8000}
          step={500}
        />
      </CardContent>
    </Card>
  );
}

function ModelSelector() {
  const models = [
    { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
    { label: "Claude 3 Opus", value: "claude-3-opus" },
    { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Modèle LLM principal</h4>
          <p className="text-sm text-muted-foreground">Choisissez le modèle d'IA pour la génération</p>
        </div>
        <select className="px-3 py-2 border rounded-md">
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Modèle de secours</h4>
          <p className="text-sm text-muted-foreground">Utilisé si le modèle principal échoue</p>
        </div>
        <select className="px-3 py-2 border rounded-md">
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface ParameterSliderProps {
  label: string;
  description: string;
  value: string;
  min: number;
  max: number;
  step: number;
}

function ParameterSlider({ label, description, value, min, max, step }: ParameterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        defaultValue={value}
        className="w-full"
      />
    </div>
  );
}

function IntegrationSettings() {
  const integrations = [
    {
      name: "OpenAI API",
      description: "sk-•••••••••••••••••••••••••",
      icon: Brain,
      color: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      name: "PostgreSQL",
      description: "postgresql://••••••••••:••••@•••••••••••/agentbuilder",
      icon: Database,
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      name: "AWS S3",
      description: "Stockage des fichiers générés",
      icon: Cloud,
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intégrations</CardTitle>
        <CardDescription>Gérez les clés API et les services externes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}>
                  <integration.icon className={`w-5 h-5 ${integration.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-medium">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Gérer</Button>
            </div>
          ))}
          
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une intégration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationSettings() {
  const notifications = [
    { label: "Email", description: "Recevoir les notifications par email", defaultChecked: true },
    { label: "Push notifications", description: "Notifications en temps réel", defaultChecked: true },
    { label: "SMS", description: "Alertes critiques par SMS", defaultChecked: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configurez les alertes et notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.label} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{notification.label}</h4>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
              <ToggleSwitch defaultChecked={notification.defaultChecked} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ToggleSwitchProps {
  defaultChecked: boolean;
}

function ToggleSwitch({ defaultChecked }: ToggleSwitchProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );
}

function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
        <CardDescription>Gérez la sécurité de votre compte et les permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PasswordSection />
        <TwoFactorSection />
        <SessionSection />
        <ApiKeysSection />
      </CardContent>
    </Card>
  );
}

function PasswordSection() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Mot de passe</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mot de passe actuel</label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nouveau mot de passe</label>
          <Input type="password" placeholder="••••••••" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="flex justify-end">
        <Button>Mettre à jour le mot de passe</Button>
      </div>
    </div>
  );
}

function TwoFactorSection() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Authentification à deux facteurs</h4>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="font-medium">2FA via application</p>
          <p className="text-sm text-muted-foreground">Utilisez une application comme Google Authenticator</p>
        </div>
        <Button variant="outline">Activer</Button>
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="font-medium">2FA via SMS</p>
          <p className="text-sm text-muted-foreground">Recevez des codes par SMS</p>
        </div>
        <Button variant="outline">Activer</Button>
      </div>
    </div>
  );
}

function SessionSection() {
  const sessions = [
    { device: "Chrome sur macOS", location: "Paris, France", lastActive: "Il y a 2 minutes", current: true },
    { device: "Safari sur iPhone", location: "Paris, France", lastActive: "Il y a 1 heure", current: false },
    { device: "Firefox sur Windows", location: "Lyon, France", lastActive: "Il y a 2 jours", current: false },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Sessions actives</h4>
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{session.device}</p>
              <p className="text-sm text-muted-foreground">{session.location} • {session.lastActive}</p>
            </div>
            <div className="flex items-center space-x-2">
              {session.current && <Badge variant="outline">Session actuelle</Badge>}
              {!session.current && <Button variant="outline" size="sm">Déconnecter</Button>}
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        Déconnecter toutes les autres sessions
      </Button>
    </div>
  );
}

function ApiKeysSection() {
  const apiKeys = [
    { name: "Clé API principale", created: "2024-01-15", lastUsed: "Il y a 5 minutes" },
    { name: "Clé API de test", created: "2024-01-10", lastUsed: "Il y a 2 jours" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Clés API</h4>
      <div className="space-y-3">
        {apiKeys.map((key, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{key.name}</p>
              <p className="text-sm text-muted-foreground">Créée le {key.created} • Dernière utilisation {key.lastUsed}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Gérer</Button>
              <Button variant="outline" size="sm">Révoquer</Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Créer une nouvelle clé API
      </Button>
    </div>
  );
}

function BillingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturation</CardTitle>
        <CardDescription>Gérez votre abonnement et les paiements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CurrentPlanSection />
        <PaymentMethodsSection />
        <BillingHistorySection />
      </CardContent>
    </Card>
  );
}

function CurrentPlanSection() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Plan actuel</h4>
      <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="text-lg font-semibold">Plan Professionnel</h5>
            <p className="text-sm text-muted-foreground">29€/mois</p>
          </div>
          <Badge variant="default">Actif</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Projets</p>
            <p className="font-medium">50/100</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Générations IA</p>
            <p className="font-medium">2,450/5,000</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button>Mettre à niveau</Button>
          <Button variant="outline">Gérer l'abonnement</Button>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodsSection() {
  const paymentMethods = [
    { type: "Carte Visa", last4: "4242", expiry: "12/25", default: true },
    { type: "Carte Mastercard", last4: "5555", expiry: "08/24", default: false },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Méthodes de paiement</h4>
      <div className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{method.type} •••• {method.last4}</p>
                <p className="text-sm text-muted-foreground">Expire {method.expiry}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {method.default && <Badge variant="outline">Par défaut</Badge>}
              <Button variant="outline" size="sm">Modifier</Button>
              <Button variant="outline" size="sm">Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Ajouter une méthode de paiement
      </Button>
    </div>
  );
}

function BillingHistorySection() {
  const billingHistory = [
    { date: "2024-01-15", amount: "29€", status: "Payé", description: "Plan Professionnel - Janvier 2024" },
    { date: "2023-12-15", amount: "29€", status: "Payé", description: "Plan Professionnel - Décembre 2023" },
    { date: "2023-11-15", amount: "29€", status: "Payé", description: "Plan Professionnel - Novembre 2023" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Historique des factures</h4>
      <div className="space-y-3">
        {billingHistory.map((bill, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{bill.description}</p>
              <p className="text-sm text-muted-foreground">{bill.date}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{bill.amount}</span>
              <Badge variant="outline">{bill.status}</Badge>
              <Button variant="outline" size="sm">Télécharger</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}