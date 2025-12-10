# Exemples de tests

Ce fichier contient des exemples de requêtes pour tester ton API.

## 🧪 Vidéos de test

Voici quelques vidéos YouTube avec sous-titres pour tester :

### Vidéos courtes (< 5 min)
- **Never Gonna Give You Up** : `dQw4w9WgXcQ` (anglais, 3:33)
- **Despacito** : `kJQP7kiw5Fk` (espagnol, 4:42)

### Vidéos moyennes (5-15 min)
- Tutoriels tech, conférences TED, etc.

### Vidéos longues (> 30 min)
- Conférences, podcasts, documentaires

## 📡 Requêtes cURL

### Test basique (GET)

```bash
# Avec URL complète
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&format=detailed"

# Avec ID vidéo
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ&format=detailed"
```

### Test avec langue spécifique

```bash
# Français
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ&lang=fr"

# Anglais
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ&lang=en"

# Espagnol
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=kJQP7kiw5Fk&lang=es"
```

### Test des différents formats

```bash
# Format détaillé (par défaut)
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ&format=detailed"

# Format avec timestamps
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ&format=timestamped"

# Format texte brut
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ&format=plain"
```

### Test POST

```bash
curl -X POST "https://ton-site.netlify.app/.netlify/functions/get-transcript" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "dQw4w9WgXcQ",
    "lang": "en",
    "format": "detailed"
  }'
```

### Sauvegarder le résultat dans un fichier

```bash
# JSON
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ" > transcript.json

# Texte formatté
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ&format=timestamped" \
  | jq -r '.text' > transcript.txt
```

### Avec jq pour formater la sortie

```bash
# Afficher seulement le texte brut
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ" \
  | jq -r '.plainText'

# Afficher seulement les 5 premières lignes
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ" \
  | jq -r '.transcript[:5]'

# Compter le nombre de segments
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ" \
  | jq '.entryCount'
```

## 🐍 Exemples Python

### Requête simple

```python
import requests

url = "https://ton-site.netlify.app/.netlify/functions/get-transcript"
params = {
    "videoId": "dQw4w9WgXcQ",
    "lang": "en",
    "format": "detailed"
}

response = requests.get(url, params=params)
data = response.json()

print(f"Video ID: {data['videoId']}")
print(f"Segments: {data['entryCount']}")
print(f"\nFirst segment: {data['transcript'][0]['text']}")
```

### Avec gestion d'erreurs

```python
import requests

def get_transcript(video_id, lang="fr", format="detailed"):
    url = "https://ton-site.netlify.app/.netlify/functions/get-transcript"
    params = {
        "videoId": video_id,
        "lang": lang,
        "format": format
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Utilisation
data = get_transcript("dQw4w9WgXcQ")
if data:
    print(f"Transcript retrieved: {data['entryCount']} segments")
```

### Sauvegarder en fichier

```python
import requests
import json

def save_transcript(video_id, filename):
    url = "https://ton-site.netlify.app/.netlify/functions/get-transcript"
    response = requests.get(url, params={"videoId": video_id})
    data = response.json()
    
    # Sauvegarder en JSON
    with open(f"{filename}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Sauvegarder le texte formatté
    with open(f"{filename}.txt", "w", encoding="utf-8") as f:
        f.write(data["formattedTranscript"])
    
    print(f"Saved to {filename}.json and {filename}.txt")

save_transcript("dQw4w9WgXcQ", "transcript")
```

## 🌐 Exemples JavaScript (Node.js)

### Avec fetch

```javascript
const fetch = require('node-fetch');

async function getTranscript(videoId, lang = 'fr') {
  const url = new URL('https://ton-site.netlify.app/.netlify/functions/get-transcript');
  url.searchParams.append('videoId', videoId);
  url.searchParams.append('lang', lang);
  url.searchParams.append('format', 'detailed');
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

// Utilisation
getTranscript('dQw4w9WgXcQ')
  .then(data => {
    console.log(`Video ID: ${data.videoId}`);
    console.log(`Segments: ${data.entryCount}`);
    console.log(`First segment: ${data.transcript[0].text}`);
  })
  .catch(error => console.error('Error:', error));
```

### Avec axios

```javascript
const axios = require('axios');

async function getTranscript(videoId) {
  try {
    const response = await axios.get(
      'https://ton-site.netlify.app/.netlify/functions/get-transcript',
      {
        params: {
          videoId: videoId,
          format: 'detailed'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Utilisation
getTranscript('dQw4w9WgXcQ')
  .then(data => {
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  });
```

## 📱 Exemple iOS Shortcuts (format JSON)

Pour tester rapidement dans iOS Shortcuts :

```
1. [Texte]
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "lang": "en",
  "format": "detailed"
}

2. [Obtenir le contenu de l'URL]
   URL: https://ton-site.netlify.app/.netlify/functions/get-transcript
   Méthode: POST
   Corps: Texte (du step 1)
   Headers:
     Content-Type: application/json

3. [Obtenir le dictionnaire depuis] Contenu de l'URL

4. [Afficher le résultat] Dictionnaire
```

## ✅ Tests de validation

### Test 1 : Vidéo avec sous-titres français
```bash
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=TEST_ID&lang=fr"
# ✅ Devrait retourner un JSON avec transcript en français
```

### Test 2 : Vidéo sans sous-titres
```bash
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=INVALID_ID"
# ❌ Devrait retourner une erreur 404 avec message explicite
```

### Test 3 : URL invalide
```bash
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?url=not-a-youtube-url"
# ❌ Devrait retourner une erreur 400
```

### Test 4 : Différents formats d'URL YouTube
```bash
# Format standard
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Format court
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?url=https://youtu.be/dQw4w9WgXcQ"

# Format embed
curl "https://ton-site.netlify.app/.netlify/functions/get-transcript?url=https://www.youtube.com/embed/dQw4w9WgXcQ"

# Tous devraient fonctionner ✅
```

## 🔍 Debug et monitoring

### Voir les logs Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Voir les logs en temps réel
netlify dev
```

### Tester en local avant déploiement

```bash
# Installer les dépendances
npm install

# Lancer le serveur local
netlify dev

# Tester
curl "http://localhost:8888/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ"
```

## 📊 Benchmarks

Utilise ces commandes pour mesurer les performances :

```bash
# Temps de réponse
time curl -s "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ" > /dev/null

# Avec plusieurs requêtes
for i in {1..10}; do
  time curl -s "https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ" > /dev/null
done
```

## 🎯 Checklist de tests

Avant de mettre en production, vérifie :

- [ ] ✅ GET fonctionne avec URL complète
- [ ] ✅ GET fonctionne avec videoId
- [ ] ✅ POST fonctionne
- [ ] ✅ Format detailed retourne tous les champs
- [ ] ✅ Format timestamped retourne le texte avec timestamps
- [ ] ✅ Format plain retourne seulement le texte
- [ ] ✅ Langue française fonctionne
- [ ] ✅ Langue anglaise fonctionne
- [ ] ✅ Erreur 400 si URL invalide
- [ ] ✅ Erreur 404 si pas de sous-titres
- [ ] ✅ CORS activé (test depuis navigateur)
- [ ] ✅ Page HTML d'accueil s'affiche
- [ ] ✅ Interface de test fonctionne

Tous les tests passent ? Tu es prêt ! 🚀
