"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Settings, 
  Cloud, 
  BarChart3, 
  Shield, 
  Database, 
  User, 
  Mail, 
  Lock,
  Bell,
  Globe,
  Key,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  Code,
  Palette
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Développeur passionné par l'IA et l'innovation",
    company: "Tech Corp",
    website: "https://johndoe.com"
  });

  // AI & LLM Settings
  const [aiSettings, setAiSettings] = useState({
    primaryModel: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "Tu es un expert en développement logiciel et en architecture système. Génère des plans détaillés et techniques.",
    enableAutoSave: true,
    enableRealTimeGeneration: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    generationComplete: true,
    billingAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  });

  // Integration Settings
  const [integrations, setIntegrations] = useState([
    { id: "github", name: "GitHub", connected: true, lastSync: "2024-01-15" },
    { id: "slack", name: "Slack", connected: false, lastSync: null },
    { id: "discord", name: "Discord", connected: true, lastSync: "2024-01-14" },
    { id: "webhook", name: "Webhook", connected: false, lastSync: null }
  ]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus({ type: 'success', message: 'Profil mis à jour avec succès !' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de la mise à jour du profil' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    }
  };

  const handleSaveAISettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus({ type: 'success', message: 'Paramètres IA mis à jour avec succès !' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de la mise à jour des paramètres IA' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus({ type: 'success', message: 'Préférences de notification enregistrées !' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de l\'enregistrement des préférences' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    }
  };

  const toggleIntegration = async (integrationId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIntegrations(prev => prev.map(int => 
        int.id === integrationId 
          ? { ...int, connected: !int.connected, lastSync: int.connected ? null : new Date().toISOString().split('T')[0] }
          : int
      ));
    } catch (error) {
      console.error("Error toggling integration:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <Button variant="ghost" size="sm" onClick={() => router.push('/projects')}>Projets</Button>
                <Button variant="ghost" size="sm">Paramètres</Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/billing')}>
                  Facturation
                </Button>
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
            <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
            <p className="text-muted-foreground">Gérez votre compte et les préférences de l'application</p>
          </div>

          {saveStatus.type && (
            <Alert className={`mb-6 ${saveStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              {saveStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{saveStatus.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </Button>
                  <Button 
                    variant={activeTab === "ai" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("ai")}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    AI & LLM
                  </Button>
                  <Button 
                    variant={activeTab === "notifications" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === "integrations" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("integrations")}
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    Intégrations
                  </Button>
                  <Button 
                    variant={activeTab === "security" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Sécurité
                  </Button>
                  <Button 
                    variant={activeTab === "billing" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => router.push('/billing')}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Facturation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profil</CardTitle>
                    <CardDescription>Informations de votre compte</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input 
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Entreprise</Label>
                        <Input 
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile({...profile, company: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Site web</Label>
                        <Input 
                          id="website"
                          type="url"
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio"
                        placeholder="Décrivez-vous..."
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les changements
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI & LLM Settings */}
              {activeTab === "ai" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration AI & LLM</CardTitle>
                    <CardDescription>Personnalisez les modèles d'IA et leurs paramètres</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Modèle LLM principal</h4>
                          <p className="text-sm text-muted-foreground">Choisissez le modèle d'IA pour la génération</p>
                        </div>
                        <select 
                          id="primary-model"
                          aria-label="Modèle LLM principal"
                          className="px-3 py-2 border rounded-md"
                          value={aiSettings.primaryModel}
                          onChange={(e) => setAiSettings({...aiSettings, primaryModel: e.target.value})}
                        >
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="claude-3-opus">Claude 3 Opus</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Température: {aiSettings.temperature}</Label>
                        <input 
                          id="temperature"
                          type="range" 
                          min="0" 
                          max="2" 
                          step="0.1"
                          value={aiSettings.temperature}
                          onChange={(e) => setAiSettings({...aiSettings, temperature: parseFloat(e.target.value)})}
                          className="w-full"
                          title={`Température: ${aiSettings.temperature}`}
                          aria-label={`Température: ${aiSettings.temperature}`}
                        />
                        <p className="text-sm text-muted-foreground">
                          Contrôle la créativité de l'IA. Plus élevé = plus créatif, plus bas = plus précis
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxTokens">Tokens maximum</Label>
                        <Input 
                          id="maxTokens"
                          type="number"
                          value={aiSettings.maxTokens}
                          onChange={(e) => setAiSettings({...aiSettings, maxTokens: parseInt(e.target.value)})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="systemPrompt">Prompt système</Label>
                        <Textarea 
                          id="systemPrompt"
                          value={aiSettings.systemPrompt}
                          onChange={(e) => setAiSettings({...aiSettings, systemPrompt: e.target.value})}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Options avancées</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            checked={aiSettings.enableAutoSave}
                            onChange={(e) => setAiSettings({...aiSettings, enableAutoSave: e.target.checked})}
                          />
                          <span className="text-sm">Sauvegarde automatique des générations</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            checked={aiSettings.enableRealTimeGeneration}
                            onChange={(e) => setAiSettings({...aiSettings, enableRealTimeGeneration: e.target.checked})}
                          />
                          <span className="text-sm">Génération en temps réel</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveAISettings} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les paramètres
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de notification</CardTitle>
                    <CardDescription>Gérez comment et quand vous recevez des notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Notifications par email</h4>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">Notifications par email</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm">Mises à jour de projet</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={notificationSettings.projectUpdates}
                            onChange={(e) => setNotificationSettings({...notificationSettings, projectUpdates: e.target.checked})}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Génération terminée</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={notificationSettings.generationComplete}
                            onChange={(e) => setNotificationSettings({...notificationSettings, generationComplete: e.target.checked})}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Database className="w-4 h-4" />
                            <span className="text-sm">Alertes de facturation</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={notificationSettings.billingAlerts}
                            onChange={(e) => setNotificationSettings({...notificationSettings, billingAlerts: e.target.checked})}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-sm">Rapports hebdomadaires</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={notificationSettings.weeklyReports}
                            onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Palette className="w-4 h-4" />
                            <span className="text-sm">Emails marketing</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={notificationSettings.marketingEmails}
                            onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveNotifications} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les préférences
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Integration Settings */}
              {activeTab === "integrations" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Intégrations</CardTitle>
                    <CardDescription>Connectez vos outils et services préférés</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {integrations.map((integration) => (
                        <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              integration.connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {integration.connected ? <CheckCircle className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-medium">{integration.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {integration.connected 
                                  ? `Connecté • Dernière synchro: ${integration.lastSync}`
                                  : 'Non connecté'
                                }
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant={integration.connected ? "outline" : "default"}
                            onClick={() => toggleIntegration(integration.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : integration.connected ? (
                              "Déconnecter"
                            ) : (
                              "Connecter"
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Ajouter une intégration personnalisée</h4>
                      <div className="flex gap-2">
                        <Input placeholder="URL du webhook" />
                        <Button variant="outline">
                          <Globe className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                    <CardDescription>Gérez la sécurité de votre compte</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Mot de passe</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Mot de passe actuel</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nouveau mot de passe</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button>
                          <Key className="w-4 h-4 mr-2" />
                          Mettre à jour le mot de passe
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Authentification à deux facteurs</h4>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">2FA via SMS</div>
                          <div className="text-sm text-muted-foreground">
                            Ajoutez une couche de sécurité supplémentaire
                          </div>
                        </div>
                        <Button variant="outline">Activer</Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Sessions actives</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Chrome sur Windows</div>
                            <div className="text-sm text-muted-foreground">Paris, France • Actif maintenant</div>
                          </div>
                          <Badge variant="outline">Session actuelle</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Safari sur iPhone</div>
                            <div className="text-sm text-muted-foreground">Lyon, France • Il y a 2 heures</div>
                          </div>
                          <Button variant="outline" size="sm">Déconnecter</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}