# YouTube Transcript Service

Service Netlify pour extraire les transcripts de vidéos YouTube avec timestamps, conçu pour être utilisé avec iOS Shortcuts et Craft.

## 🚀 Déploiement sur Netlify

### Méthode 1 : Via GitHub (recommandée)

1. **Créer un dépôt GitHub**
   - Va sur https://github.com/new
   - Crée un nouveau dépôt (public ou privé)
   - Clone le dépôt localement et copie tous ces fichiers dedans
   - Commit et push :
     ```bash
     git add .
     git commit -m "Initial commit"
     git push origin main
     ```

2. **Déployer sur Netlify**
   - Va sur https://app.netlify.com
   - Clique sur "Add new site" > "Import an existing project"
   - Choisis "GitHub" et sélectionne ton dépôt
   - Configuration du build (normalement auto-détectée) :
     - Build command : (laisser vide)
     - Publish directory : (laisser vide)
   - Clique sur "Deploy site"

3. **Récupérer l'URL**
   - Une fois déployé, tu auras une URL du type : `https://ton-site.netlify.app`
   - L'API sera accessible à : `https://ton-site.netlify.app/.netlify/functions/get-transcript`

### Méthode 2 : Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

## 📡 Utilisation de l'API

### Endpoint

```
GET/POST https://ton-site.netlify.app/.netlify/functions/get-transcript
```

### Paramètres

| Paramètre | Type | Requis | Description | Défaut |
|-----------|------|--------|-------------|--------|
| `url` | string | Oui* | URL complète YouTube | - |
| `videoId` | string | Oui* | ID vidéo (11 caractères) | - |
| `lang` | string | Non | Code langue (ISO 639-1) | `fr` |
| `format` | string | Non | Format de sortie | `detailed` |

*Un seul des deux (`url` ou `videoId`) est requis

### Formats de sortie

- **`detailed`** (défaut) : Retourne le transcript avec timestamps, texte brut et formatté
- **`timestamped`** : Retourne uniquement le texte avec timestamps
- **`plain`** : Retourne uniquement le texte brut

### Exemples de requêtes

#### JavaScript (GET)
```javascript
const response = await fetch(
  'https://ton-site.netlify.app/.netlify/functions/get-transcript?' + 
  new URLSearchParams({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lang: 'fr',
    format: 'detailed'
  })
);
const data = await response.json();
```

#### JavaScript (POST)
```javascript
const response = await fetch(
  'https://ton-site.netlify.app/.netlify/functions/get-transcript',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      lang: 'fr',
      format: 'detailed'
    })
  }
);
const data = await response.json();
```

#### cURL
```bash
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&format=detailed"
```

### Exemple de réponse (format detailed)

```json
{
  "videoId": "dQw4w9WgXcQ",
  "language": "fr",
  "entryCount": 42,
  "transcript": [
    {
      "timestamp": "0:00",
      "seconds": 0.0,
      "text": "Bienvenue dans cette vidéo"
    },
    {
      "timestamp": "0:05",
      "seconds": 5.2,
      "text": "Aujourd'hui nous allons parler de..."
    }
  ],
  "formattedTranscript": "[0:00] Bienvenue dans cette vidéo\n[0:05] Aujourd'hui nous allons parler de...",
  "plainText": "Bienvenue dans cette vidéo Aujourd'hui nous allons parler de..."
}
```

## 📱 Intégration iOS Shortcuts

### Architecture du raccourci

Le raccourci iOS suivra cette logique :

```
1. Recevoir URL YouTube (Share Sheet ou presse-papier)
2. Appeler l'API Transcript pour obtenir le texte
3. Appeler l'API Claude pour générer un résumé
4. Demander à l'utilisateur ses notes
5. Créer un document Craft avec les 3 sections
```

### Configuration requise

Tu auras besoin de :
- L'URL de ton service Netlify : `https://ton-site.netlify.app`
- Une clé API Anthropic : https://console.anthropic.com
- Craft MCP déjà configuré sur ton iPhone

### Étapes pour créer le raccourci iOS

Je vais créer un fichier avec les actions détaillées pour le raccourci.

## 🔑 API Claude pour le résumé

Pour générer le résumé, tu utiliseras l'API Anthropic directement depuis iOS Shortcuts :

```javascript
// Endpoint
POST https://api.anthropic.com/v1/messages

// Headers
{
  "x-api-key": "ta-clé-api",
  "anthropic-version": "2023-06-01",
  "content-type": "application/json"
}

// Body
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Résume cette transcription vidéo en exactement 100 mots :\n\n[TRANSCRIPT]"
    }
  ]
}
```

## 🧪 Test

Une fois déployé, visite `https://ton-site.netlify.app` pour accéder à l'interface de test.

## ⚠️ Limitations

- Fonctionne uniquement avec les vidéos ayant des sous-titres (automatiques ou manuels)
- La qualité du transcript dépend de la qualité des sous-titres YouTube
- Pas de limite de requêtes (mais respecte les limites de Netlify gratuit : 125k requêtes/mois)

## 🔧 Dépannage

### Erreur "Aucun sous-titre disponible"
- La vidéo n'a pas de sous-titres activés
- Essaye avec une autre langue via le paramètre `lang`

### Erreur CORS
- Vérifie que tu accèdes bien via l'URL Netlify complète
- Les headers CORS sont configurés pour accepter toutes les origines

### Timeout
- Les vidéos très longues (>2h) peuvent prendre plus de temps
- Netlify Functions ont un timeout de 10 secondes en gratuit, 26 secondes en Pro

## 📝 Licence

MIT

## 🤝 Support

Pour toute question, ouvre une issue sur GitHub.
