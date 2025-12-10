# Guide iOS Shortcuts : YouTube → Craft

Ce guide explique comment créer le raccourci iOS qui transforme une vidéo YouTube en document Craft avec résumé, transcript et notes.

## 📋 Prérequis

1. **Service Netlify déployé** avec l'URL : `https://ton-site.netlify.app`
2. **Clé API Anthropic** : Obtiens-la sur https://console.anthropic.com
3. **Craft MCP activé** sur iOS
4. **App Shortcuts** installée

## 🏗️ Structure du raccourci

### Variables globales (en haut du raccourci)

Crée ces variables de texte :
- `netlifyURL` : `https://ton-site.netlify.app/.netlify/functions/get-transcript`
- `anthropicKey` : `ta-clé-api-anthropic`
- `anthropicURL` : `https://api.anthropic.com/v1/messages`

## 📝 Actions détaillées

### Bloc 1 : Récupérer l'URL YouTube

```
1. [Recevoir] Input depuis Share Sheet
   Type: URLs
   
2. [Si] Input existe
   → [Définir variable] youtubeURL = Input
   
3. [Sinon]
   → [Obtenir le presse-papier]
   → [Définir variable] youtubeURL = Presse-papier
   
4. [Fin Si]
```

### Bloc 2 : Appeler l'API Transcript

```
5. [URL] = Variable netlifyURL

6. [Obtenir le contenu de l'URL]
   Méthode: GET
   En-têtes:
     - Content-Type: application/json
   Paramètres:
     - url: Variable youtubeURL
     - lang: fr
     - format: detailed

7. [Obtenir le dictionnaire depuis] Contenu de l'URL

8. [Définir variable] transcriptData = Dictionnaire

9. [Obtenir la valeur pour] videoId dans transcriptData
   → [Définir variable] videoID = Valeur

10. [Obtenir la valeur pour] plainText dans transcriptData
    → [Définir variable] plainTranscript = Valeur

11. [Obtenir la valeur pour] formattedTranscript dans transcriptData
    → [Définir variable] formattedTranscript = Valeur
```

### Bloc 3 : Générer le résumé avec Claude

```
12. [Texte] Prompt:
Résume cette transcription vidéo YouTube en exactement 100 mots. Le résumé doit être concis, informatif et capturer les points clés de la vidéo.

Transcription:
[Variable plainTranscript]

13. [URL] = Variable anthropicURL

14. [Obtenir le contenu de l'URL]
    Méthode: POST
    En-têtes:
      - x-api-key: Variable anthropicKey
      - anthropic-version: 2023-06-01
      - content-type: application/json
    Corps de la requête: JSON
    {
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1000,
      "messages": [
        {
          "role": "user",
          "content": [Texte du prompt]
        }
      ]
    }

15. [Obtenir le dictionnaire depuis] Contenu de l'URL

16. [Obtenir la valeur pour] content dans Dictionnaire
    → [Obtenir l'élément à l'index] 0
    → [Obtenir la valeur pour] text
    → [Définir variable] summary = Texte
```

### Bloc 4 : Demander les notes à l'utilisateur

```
17. [Demander une entrée]
    Question: "Veux-tu ajouter des notes personnelles ?"
    Type d'entrée: Texte
    Texte par défaut: ""
    Autoriser plusieurs lignes: Oui

18. [Définir variable] userNotes = Réponse fournie
```

### Bloc 5 : Construire le document Markdown

```
19. [Texte] Document complet:
# 📹 Vidéo YouTube - [Variable videoID]

## 📊 Résumé

[Variable summary]

---

## 📝 Transcription complète

[Variable formattedTranscript]

---

## 💭 Notes personnelles

[Variable userNotes]

---

*Document généré automatiquement le [Date actuelle]*
*Lien vidéo: [Variable youtubeURL]*

20. [Définir variable] markdownContent = Texte
```

### Bloc 6 : Créer le document dans Craft

Il y a deux approches possibles :

#### Option A : Via Craft MCP (si tu peux appeler MCP depuis Shortcuts)

```
21. [Exécuter le raccourci] "Craft - Create Document"
    Avec entrée:
      - title: "YouTube - [videoID]"
      - content: Variable markdownContent
      - location: "unsorted"
```

#### Option B : Via l'API Craft directement

```
21. [URL] Craft API endpoint
    https://api.craft.do/v1/documents

22. [Obtenir le contenu de l'URL]
    Méthode: POST
    En-têtes:
      - Authorization: Bearer [ta-clé-craft]
      - Content-Type: application/json
    Corps:
    {
      "spaceId": "ton-space-id",
      "title": "YouTube - [Variable videoID]",
      "content": [Variable markdownContent],
      "location": {
        "spaceId": "ton-space-id",
        "type": "unsorted"
      }
    }

23. [Obtenir le dictionnaire depuis] Contenu de l'URL
    → [Obtenir la valeur pour] id
    → [Définir variable] craftDocID = ID
```

#### Option C : Via URL Scheme Craft (le plus simple)

```
21. [Texte] URL Scheme:
craftdocs://x-callback-url/createdocument?title=YouTube%20[videoID]&content=[markdownContent encodé URL]&location=home

22. [Ouvrir l'URL] URL Scheme
```

### Bloc 7 : Notification de succès

```
24. [Afficher la notification]
    Titre: "✅ Document créé"
    Corps: "Transcript de la vidéo [videoID] ajouté à Craft"
```

## 🎯 Version simplifiée du raccourci

Si tu veux une version plus simple pour commencer, voici l'essentiel :

```
1. Recevoir URL YouTube
2. GET vers ton API Netlify
3. POST vers Claude API pour résumé
4. Demander notes utilisateur
5. Créer document Craft avec markdown_add
6. Afficher notification
```

## 🔧 Configuration Craft MCP

Pour utiliser Craft MCP depuis le raccourci, tu peux :

### Méthode 1 : Créer un raccourci intermédiaire

Crée un raccourci appelé "Craft - Markdown Add" qui :
```
1. Reçoit : markdownContent (texte)
2. Appelle : Craft MCP markdown_add avec le contenu
3. Retourne : ID du document créé
```

Puis appelle ce raccourci depuis ton raccourci principal :
```
Exécuter le raccourci "Craft - Markdown Add"
  Avec entrée: Variable markdownContent
```

### Méthode 2 : URL Scheme Craft

Le plus simple est d'utiliser le URL Scheme de Craft :

```
craftdocs://x-callback-url/createdocument?
  title=YouTube%20Transcript
  &content=[ton markdown encodé]
  &location=home
```

## 🧪 Test du raccourci

1. **Test avec une vidéo courte** (2-3 minutes) pour commencer
2. **Vérifie chaque étape** :
   - L'URL est bien extraite
   - L'API transcript répond
   - Claude génère un résumé
   - Le document Craft est créé
3. **Teste depuis** :
   - Share Sheet YouTube
   - Presse-papier avec URL
   - App Shortcuts directement

## ⚡ Optimisations possibles

### Ajout de la vignette YouTube

```
Après le bloc 1 (récupération URL) :

A. [Obtenir les détails de l'URL] Variable youtubeURL
   → Type: Embed Image

B. [Obtenir l'image depuis] Détails
   → [Définir variable] thumbnail = Image

C. Dans le markdown, ajoute :
   ![Vignette](data:image/jpeg;base64,[thumbnail en base64])
```

### Gestion des erreurs

```
Après chaque appel réseau, ajoute :

[Si] Status Code = 200
  → Continue
[Sinon]
  → [Afficher alerte]
      Titre: "Erreur"
      Message: "Impossible de [action]. Code: [Status Code]"
  → [Arrêter le raccourci]
[Fin Si]
```

### Cache local

Pour éviter de re-télécharger le même transcript :

```
1. [Obtenir le fichier] "transcripts/[videoID].json"
   Depuis: iCloud Drive/Shortcuts

2. [Si] Fichier existe
   → Utilise le fichier existant
   
3. [Sinon]
   → Télécharge depuis l'API
   → [Sauvegarder le fichier] JSON dans iCloud
```

## 📱 Icône et nom du raccourci

- **Nom** : "YouTube → Craft"
- **Icône** : 📹 ou 🎬
- **Couleur** : Rouge (YouTube) ou Violet (Craft)
- **Partager depuis** : Safari, YouTube App

## 🎁 Bonus : Variantes

### Variante 1 : Avec chapitres

Si la vidéo a des chapitres, extrais-les et ajoute une section :

```
## 📑 Chapitres

- [00:00] Introduction
- [02:15] Première partie
- [05:30] Conclusion
```

### Variante 2 : Export vers Day One

Ajoute à la fin :

```
[Demander] "Veux-tu aussi créer une entrée Day One ?"

[Si] Oui
  → [Créer une entrée Day One]
      Journal: YouTube
      Tags: video, notes
      Texte: [résumé et lien]
```

### Variante 3 : Résumé en plusieurs longueurs

Demande à Claude 3 résumés :
- Court (50 mots)
- Moyen (100 mots)  
- Long (300 mots)

Et crée des sections dans Craft avec chaque version.

## 🆘 Dépannage

### Le raccourci est trop lent
- Réduis le nombre d'appels API
- Mets en cache les résultats
- Utilise format "plain" au lieu de "detailed"

### Erreur "No transcript found"
- Vérifie que la vidéo a des sous-titres
- Essaye lang="en" au lieu de "fr"
- Vérifie l'URL de la vidéo

### Le document Craft n'est pas créé
- Vérifie que Craft MCP est bien configuré
- Teste d'abord avec l'URL Scheme
- Regarde les logs dans Shortcuts

### Le résumé est trop long/court
- Ajuste le prompt Claude
- Change max_tokens dans l'API call
- Demande un format spécifique (bullet points, etc.)

## 📚 Ressources

- Documentation Shortcuts : https://support.apple.com/guide/shortcuts/
- Craft API : https://docs.craft.do
- Claude API : https://docs.anthropic.com
- YouTube API : https://developers.google.com/youtube

Bon développement ! 🚀
