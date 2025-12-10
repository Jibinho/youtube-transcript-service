# Configuration du raccourci iOS

Ce fichier contient toutes les valeurs que tu devras configurer dans ton raccourci iOS.

## 🔐 Configuration des APIs

Remplace ces valeurs par les tiennes :

```json
{
  "netlifyURL": "https://TON-SITE.netlify.app/.netlify/functions/get-transcript",
  "anthropicKey": "sk-ant-api03-...",
  "anthropicURL": "https://api.anthropic.com/v1/messages",
  "craftSpaceId": "ton-space-id-craft",
  "defaultLanguage": "fr",
  "summaryWordCount": 100
}
```

## 📝 Prompts Claude configurables

### Prompt pour le résumé

```
Résume cette transcription vidéo YouTube en exactement 100 mots. Le résumé doit être concis, informatif et capturer les points clés de la vidéo. Utilise un style clair et professionnel.

Transcription:
{TRANSCRIPT}

Résumé:
```

### Prompt pour extraire les points clés

```
À partir de cette transcription vidéo, extrais les 5 points clés les plus importants. Formatte-les en liste à puces markdown.

Transcription:
{TRANSCRIPT}

Points clés:
```

### Prompt pour les questions/réponses

```
À partir de cette transcription vidéo, génère 3 questions importantes et leurs réponses basées sur le contenu.

Transcription:
{TRANSCRIPT}

Questions et réponses:
```

## 📄 Template Markdown du document Craft

```markdown
# 📹 {VIDEO_TITLE}

> **Vidéo ID:** {VIDEO_ID}  
> **Langue:** {LANGUAGE}  
> **Date:** {DATE}  
> **Durée:** {DURATION}

---

## 📊 Résumé en {WORD_COUNT} mots

{SUMMARY}

---

## 🔑 Points clés

{KEY_POINTS}

---

## 📝 Transcription complète

{FORMATTED_TRANSCRIPT}

---

## 💭 Notes personnelles

{USER_NOTES}

---

## 🔗 Liens

- [▶️ Voir la vidéo]({VIDEO_URL})
- [📋 Voir le transcript brut]({TRANSCRIPT_URL})

---

*Document généré automatiquement le {CREATION_DATE}*
*Service: YouTube Transcript + Claude AI*
```

## 🎨 Variantes de templates

### Template minimaliste

```markdown
# {VIDEO_TITLE}

## Résumé
{SUMMARY}

## Transcript
{FORMATTED_TRANSCRIPT}

## Notes
{USER_NOTES}

[Voir la vidéo]({VIDEO_URL})
```

### Template enrichi avec métadonnées

```markdown
# 📹 {VIDEO_TITLE}

<callout>
**ℹ️ Informations**

- **ID:** {VIDEO_ID}
- **Langue:** {LANGUAGE}
- **Date de création:** {CREATION_DATE}
- **Nombre de segments:** {SEGMENT_COUNT}
- **Durée estimée:** {DURATION}
</callout>

---

## 📊 Résumé exécutif

{SUMMARY}

---

## 🎯 Points clés à retenir

{KEY_POINTS}

---

## 📖 Transcription complète

<caption>
💡 Astuce : Les timestamps permettent de retrouver rapidement les passages importants
</caption>

{FORMATTED_TRANSCRIPT}

---

## 💭 Mes notes et réflexions

{USER_NOTES}

---

## 🏷️ Tags suggérés

{SUGGESTED_TAGS}

---

<caption>
Document généré automatiquement le {CREATION_DATE}  
[▶️ Voir la vidéo]({VIDEO_URL}) | [🔄 Régénérer]({SHORTCUT_URL})
</caption>
```

### Template pour prise de notes pendant visionnage

```markdown
# 🎬 {VIDEO_TITLE}

## ⏱️ Transcription avec timestamps

{FORMATTED_TRANSCRIPT}

---

## 📝 Mes notes (à compléter pendant le visionnage)

### 💡 Idées principales


### ❓ Questions


### ✅ Actions à faire


### 🔖 Citations importantes


---

## 📊 Résumé final

{SUMMARY}

---

[▶️ Voir la vidéo]({VIDEO_URL})
```

## 🎛️ Options de personnalisation

### Formats de timestamp

Choisis ton format préféré :

```javascript
// Format 1 : Simple
"[0:00] Texte..."
"[2:45] Texte..."

// Format 2 : Avec liens (si Craft supporte)
"[0:00](youtube://video-id?t=0) Texte..."
"[2:45](youtube://video-id?t=165) Texte..."

// Format 3 : Avec emoji
"⏰ 0:00 - Texte..."
"⏰ 2:45 - Texte..."

// Format 4 : Table (pour transcripts courts)
| Timestamp | Contenu |
|-----------|---------|
| 0:00 | Texte... |
| 2:45 | Texte... |
```

### Langues supportées

```javascript
const languages = {
  "fr": "Français",
  "en": "English",
  "es": "Español",
  "de": "Deutsch",
  "it": "Italiano",
  "pt": "Português",
  "ja": "日本語",
  "ko": "한국어",
  "zh": "中文"
}
```

### Niveaux de détail du résumé

```javascript
const summaryLevels = {
  "brief": 50,      // Résumé très court
  "standard": 100,  // Résumé standard
  "detailed": 200,  // Résumé détaillé
  "comprehensive": 300 // Résumé complet
}
```

## 🔔 Messages de notification

### Succès

```
✅ Document créé avec succès
Transcript de {VIDEO_TITLE} ajouté à Craft

📊 Stats:
- {SEGMENT_COUNT} segments
- Résumé: {WORD_COUNT} mots
- Durée estimée: {DURATION}
```

### Erreur - Pas de sous-titres

```
❌ Impossible d'extraire le transcript
Cette vidéo n'a pas de sous-titres disponibles.

💡 Suggestions:
- Vérifie que les sous-titres sont activés
- Essaye avec une autre langue
- Contacte l'auteur de la vidéo
```

### Erreur - API

```
⚠️ Erreur de connexion
Impossible de contacter le service.

🔧 Que faire:
- Vérifie ta connexion internet
- Réessaye dans quelques instants
- Vérifie tes clés API
```

## 📊 Métriques à afficher (optionnel)

Si tu veux afficher des stats en fin de document :

```markdown
---

## 📈 Statistiques

- **Segments de transcript:** {SEGMENT_COUNT}
- **Mots dans le transcript:** {WORD_COUNT}
- **Durée estimée de lecture:** {READING_TIME} min
- **Durée de la vidéo:** {VIDEO_DURATION}
- **Ratio compression:** {COMPRESSION_RATIO}%

*Le résumé représente {COMPRESSION_RATIO}% du texte original*
```

## 🎨 Personnalisation Craft

### Collections suggérées

Tu peux créer une collection "Vidéos YouTube" dans Craft avec ces propriétés :

```
- Titre (texte)
- Video ID (texte)
- URL (url)
- Langue (select: fr, en, es...)
- Durée (nombre)
- Date d'ajout (date)
- Résumé (texte long)
- Tags (multi-select)
- Statut (select: À voir, En cours, Vu, Archivé)
- Note (nombre 1-5)
```

### Tags automatiques

Suggestions de tags à ajouter automatiquement :

```javascript
const autoTags = [
  "youtube",
  "video",
  "transcript",
  "{LANGUAGE}",  // fr, en, etc.
  "{DATE}"       // 2025-01
]
```

## 🛠️ Fonctions utilitaires

### Estimation de la durée de lecture

```javascript
// Formule simple : 200 mots par minute
const readingTime = Math.ceil(wordCount / 200);
```

### Formatage de la durée vidéo

```javascript
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h${minutes}min`;
  }
  return `${minutes}min`;
}
```

### Génération de tags intelligents

Demande à Claude de suggérer des tags :

```
À partir de cette transcription, suggère 3-5 tags pertinents au format hashtag (exemple: #tutoriel #programmation). Sois concis et précis.

Transcription:
{TRANSCRIPT}

Tags:
```

## 💾 Sauvegarde et historique

### Structure de fichiers suggérée dans iCloud

```
iCloud Drive/
└── Shortcuts/
    └── YouTube Transcripts/
        ├── cache/
        │   └── {VIDEO_ID}.json
        ├── exports/
        │   └── {VIDEO_ID}.md
        └── config.json
```

### Fichier de configuration persistant

```json
{
  "version": "1.0",
  "lastUpdated": "2025-01-15",
  "settings": {
    "defaultLanguage": "fr",
    "summaryWordCount": 100,
    "autoAddToCraft": true,
    "saveLocalCopy": true,
    "notificationLevel": "standard"
  },
  "stats": {
    "totalTranscripts": 42,
    "totalWords": 125000,
    "favoriteLanguage": "fr"
  }
}
```

## 🚀 Prêt à démarrer ?

1. ✅ Remplace les valeurs de configuration
2. ✅ Choisis ton template préféré
3. ✅ Configure les prompts Claude
4. ✅ Crée ton raccourci iOS
5. ✅ Teste avec une vidéo courte
6. ✅ Ajuste selon tes besoins

Bon développement ! 🎉
