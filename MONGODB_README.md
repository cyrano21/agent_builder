# Next.js Project with MongoDB Atlas - Version Téléchargeable

## 📋 Description

Ce projet Next.js a été entièrement migré de SQLite vers MongoDB Atlas. Il inclut toutes les fonctionnalités originales avec les avantages d'une base de données NoSQL cloud native.

## 🚀 Nouveautés de cette version

### ✅ Migration MongoDB Complète
- **Base de données** : MongoDB Atlas (cloud)
- **Schéma Prisma** : entièrement compatible MongoDB
- **Performance** : optimisée pour les charges de travail cloud
- **Évolutivité** : gère automatiquement la croissance des données

### 🔧 Configuration Prête à l'Emploi
- **Variables d'environnement** : préconfigurées pour MongoDB Atlas
- **Docker** : configurations mises à jour pour le déploiement cloud
- **Scripts** : outils de seeding et gestion de base de données

## 📦 Contenu du Package

### 🏗️ Structure du Projet
```
my-project/
├── src/                    # Code source
│   ├── app/               # Pages Next.js (App Router)
│   ├── components/        # Composants React
│   ├── lib/               # Utilitaires et configurations
│   └── hooks/             # Hooks personnalisés
├── prisma/                # Schéma de base de données
├── scripts/               # Scripts de seeding
├── docker-compose*.yml    # Configurations Docker
├── *.env                  # Variables d'environnement
└── MONGODB_README.md      # Ce fichier
```

### 🗄️ Base de Données MongoDB Atlas

#### Collections Créées
- `users` - Utilisateurs et authentification
- `projects` - Projets et leur statut
- `project_templates` - Templates de projet
- `teams` - Équipes et collaboration
- `project_deliverables` - Livrables de projet
- `subscriptions` - Abonnements et facturation
- `notifications` - Notifications utilisateurs
- Et plus...

#### Données de Démonstration
- **1 utilisateur** : demo@example.com
- **3 projets** : E-commerce, Task Management, Fitness Tracker
- **2 templates** : Web App, Mobile App
- **1 équipe** : Demo Team
- **2 livrables** : Documentation et architecture
- **2 notifications** : Exemples de notifications

## 🛠️ Installation et Configuration

### 1. Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte MongoDB Atlas (gratuit disponible)

### 2. Extraction
```bash
tar -xzf my-project-mongodb.tar.gz
cd my-project
```

### 3. Installation des Dépendances
```bash
npm install
```

### 4. Configuration de la Base de Données

#### Option A: Utiliser MongoDB Atlas (Recommandé)
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster (gratuit disponible)
3. Mettez à jour les variables d'environnement :

```bash
# .env.local
MONGODB_URI="mongodb+srv://votre-utilisateur:votre-mot-de-passe@cluster.mongodb.net/my-project?retryWrites=true&w=majority"
DATABASE_URL="mongodb+srv://votre-utilisateur:votre-mot-de-passe@cluster.mongodb.net/my-project?retryWrites=true&w=majority"
NEXTAUTH_SECRET="votre-secret-securise"
NEXTAUTH_URL="http://localhost:3000"
ZAI_API_KEY="votre-cle-api-z-ai"
```

#### Option B: Utiliser la Configuration Existante
Le projet est préconfiguré avec les informations MongoDB Atlas fournies :
- **Cluster** : cluster0.1yh3agm.mongodb.net
- **Base de données** : my-project
- **Utilisateur** : louiscyrano

### 5. Initialisation de la Base de Données
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers MongoDB
npm run db:push

# Peupler avec les données de démonstration
npm run db:seed
```

### 6. Démarrage de l'Application
```bash
npm run dev
```

Visitez http://localhost:3000 pour voir l'application en action.

## 🐳 Déploiement avec Docker

### Développement
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
docker-compose up -d
```

## 🌟 Fonctionnalités Principales

### 🎯 Gestion de Projets
- Création et gestion de projets
- Templates prédéfinis (Web App, Mobile App)
- Suivi de progression
- Génération de livrables avec IA

### 👥 Collaboration
- Équipes et membres
- Partage de projets
- Commentaires et notifications
- Rôles et permissions

### 🤖 Intégration IA
- Génération de plans de projet
- Création d'architecture
- Design et wireframes
- Documentation automatique

### 📊 Analytics et Reporting
- Tableaux de bord
- Statistiques de projet
- Export de données
- Monitoring en temps réel

## 🔧 Scripts Utiles

```bash
# Développement
npm run dev                    # Démarrer le serveur de développement
npm run build                  # Construire pour la production
npm run start                  # Démarrer en production

# Base de données
npm run db:generate            # Générer le client Prisma
npm run db:push                # Pousser le schéma
npm run db:seed                # Peupler la base de données
npm run db:seed:prod           # Peupler en production

# Qualité
npm run lint                  # Vérification du code
```

## 🌍 Déploiement

### Vercel (Recommandé)
1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres Plateformes
- **Netlify** : Importez le projet build
- **AWS** : Utilisez ECS ou Lambda
- **Google Cloud** : Cloud Run ou App Engine
- **Digital Ocean** : App Platform

## 🔐 Sécurité

### Variables d'Environnement
- Ne jamais committer `.env.local`
- Utiliser des secrets forts
- Rotation régulière des clés

### MongoDB Atlas
- Connexions SSL/TLS obligatoires
- Contrôle d'accès IP
- Authentification par mot de passe

### Application
- NextAuth.js pour l'authentification
- Validation des entrées
- Protection CSRF

## 📈 Performance

### Optimisations
- MongoDB Atlas pour la base de données
- Redis pour le cache
- Next.js pour le rendu côté serveur
- Optimisation des images

### Monitoring
- Tableau de bord MongoDB Atlas
- Logs applicatifs
- Métriques de performance

## 🛠️ Dépannage

### Problèmes Communs

#### Connexion MongoDB
```bash
# Vérifier la connexion
npm run db:push

# Erreur de connexion ? Vérifier :
# - L'URL MongoDB est correcte
# - Les identifiants sont valides
# - L'accès IP est autorisé dans Atlas
```

#### Port Déjà Utilisé
```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9

# Ou utiliser un port différent
PORT=3001 npm run dev
```

#### Dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation Supplémentaire

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Support

Pour obtenir de l'aide :
1. Consultez les logs de l'application
2. Vérifiez le tableau de bord MongoDB Atlas
3. Consultez la documentation ci-dessus
4. Créez une issue sur le dépôt GitHub

## 📄 Licence

Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus de détails.

---

**Note** : Cette version inclut toutes les configurations nécessaires pour fonctionner immédiatement avec MongoDB Atlas. Les données de démonstration sont préconfigurées pour vous permettre de tester toutes les fonctionnalités rapidement.