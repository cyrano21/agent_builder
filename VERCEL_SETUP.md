# Configuration Vercel pour NextAuth

## Variables d'environnement requises

Pour résoudre l'erreur de configuration NextAuth sur Vercel, vous devez configurer les variables d'environnement suivantes :

### Variables obligatoires

1. **NEXTAUTH_URL**
   - Valeur : `https://agent-builder-five.vercel.app`
   - Description : URL de base de votre application

2. **NEXTAUTH_SECRET**
   - Valeur : Générez une clé secrète sécurisée
   - Description : Clé secrète pour signer les tokens JWT
   - Commande pour générer : `openssl rand -base64 32`

3. **DATABASE_URL**
   - Valeur : `file:./db/custom.db`
   - Description : URL de connexion à la base de données

### Variables optionnelles (OAuth)

4. **GOOGLE_CLIENT_ID** (optionnel)
   - Description : ID client Google OAuth
   - Obtenir sur : [Google Cloud Console](https://console.cloud.google.com/)

5. **GOOGLE_CLIENT_SECRET** (optionnel)
   - Description : Secret client Google OAuth

6. **GITHUB_ID** (optionnel)
   - Description : ID client GitHub OAuth
   - Obtenir sur : [GitHub Developer Settings](https://github.com/settings/developers)

7. **GITHUB_SECRET** (optionnel)
   - Description : Secret client GitHub OAuth

## Configuration sur Vercel

### Méthode 1 : Interface Web

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `agent-builder-five`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez chaque variable avec sa valeur
5. Redéployez l'application

### Méthode 2 : CLI Vercel

```bash
# Installer Vercel CLI si nécessaire
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables d'environnement
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL

# Redéployer
vercel --prod
```

### Méthode 3 : Fichier vercel.json

Créez un fichier `vercel.json` à la racine :

```json
{
  "env": {
    "NEXTAUTH_URL": "https://agent-builder-five.vercel.app",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "DATABASE_URL": "file:./db/custom.db"
  }
}
```

## Génération de NEXTAUTH_SECRET

### Option 1 : OpenSSL
```bash
openssl rand -base64 32
```

### Option 2 : Node.js
```javascript
require('crypto').randomBytes(32).toString('base64')
```

### Option 3 : En ligne
Utilisez un générateur en ligne comme [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

## Vérification

Après avoir configuré les variables :

1. Redéployez l'application sur Vercel
2. Visitez `https://agent-builder-five.vercel.app/api/auth/signin`
3. Vérifiez qu'il n'y a plus d'erreur de configuration

## Dépannage

### Erreur persiste ?

1. Vérifiez que toutes les variables sont bien définies
2. Assurez-vous que `NEXTAUTH_URL` correspond exactement à votre domaine Vercel
3. Redéployez après chaque modification de variable
4. Consultez les logs Vercel pour plus de détails

### Logs Vercel

```bash
vercel logs --follow
```

## Sécurité

- ⚠️ Ne jamais committer les fichiers `.env` avec des vraies valeurs
- ✅ Utilisez des secrets forts pour `NEXTAUTH_SECRET`
- ✅ Configurez les domaines autorisés dans vos OAuth apps
- ✅ Utilisez HTTPS en production

---

**Note** : Les modifications apportées au code rendent les providers OAuth optionnels, donc l'application fonctionnera même sans configurer Google/GitHub OAuth.