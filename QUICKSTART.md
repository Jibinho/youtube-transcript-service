# 🚀 Guide de démarrage rapide

Mets ton service en ligne en 5 minutes !

## ⚡ Déploiement ultra-rapide

### Étape 1 : Créer un compte Netlify (2 min)

1. Va sur https://app.netlify.com
2. Inscris-toi avec GitHub, GitLab ou email
3. C'est gratuit, aucune carte bancaire requise

### Étape 2 : Déployer le service (2 min)

**Option A : Via GitHub (recommandée)**

```bash
# 1. Créer un repo GitHub
# Va sur https://github.com/new et crée "youtube-transcript-service"

# 2. Clone ce dossier et push
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/youtube-transcript-service.git
git push -u origin main

# 3. Sur Netlify
# - Clique "Add new site" > "Import an existing project"
# - Sélectionne ton repo GitHub
# - Clique "Deploy site"
```

**Option B : Drag & Drop (le plus simple)**

1. Va sur https://app.netlify.com
2. Clique "Add new site" > "Deploy manually"
3. Glisse-dépose le dossier complet
4. Attends 30 secondes, c'est en ligne !

### Étape 3 : Récupérer ton URL (30 sec)

Après déploiement, Netlify te donne une URL comme :
```
https://ton-site-123abc.netlify.app
```

Tu peux personnaliser le nom dans "Site settings" > "Change site name"

### Étape 4 : Tester (30 sec)

Ouvre dans ton navigateur :
```
https://ton-site.netlify.app
```

Tu verras l'interface de test. Clique sur "Tester l'API" !

## 📱 Configurer le raccourci iOS (5 min)

### Ce dont tu as besoin

- ✅ URL de ton service Netlify (étape 3)
- ✅ Clé API Anthropic : https://console.anthropic.com
- ✅ App iOS Shortcuts installée

### Créer le raccourci

1. **Ouvre Shortcuts sur iPhone**

2. **Crée un nouveau raccourci** : Appuie sur "+"

3. **Ajoute ces actions** (dans l'ordre) :

```
📥 ACTION 1 : Recevoir l'entrée
   Type : URLs
   Depuis : Feuille de partage

📝 ACTION 2 : Texte
   Contenu : https://TON-SITE.netlify.app/.netlify/functions/get-transcript

🌐 ACTION 3 : Obtenir le contenu de l'URL
   URL : Texte (action 2)
   Méthode : GET
   Paramètres :
     - url : Entrée (action 1)
     - format : detailed

📦 ACTION 4 : Obtenir le dictionnaire
   Depuis : Contenu de l'URL

📋 ACTION 5 : Obtenir la valeur
   Clé : plainText
   Depuis : Dictionnaire

💬 ACTION 6 : Texte (Prompt pour Claude)
   "Résume cette vidéo YouTube en 100 mots :
   
   [Insérer le résultat de l'action 5]"

🌐 ACTION 7 : Obtenir le contenu de l'URL
   URL : https://api.anthropic.com/v1/messages
   Méthode : POST
   En-têtes :
     - x-api-key : TA-CLÉ-ANTHROPIC
     - anthropic-version : 2023-06-01
     - content-type : application/json
   Corps : JSON
   {
     "model": "claude-sonnet-4-20250514",
     "max_tokens": 1000,
     "messages": [{"role": "user", "content": "[Action 6]"}]
   }

📦 ACTION 8 : Obtenir le dictionnaire
   Depuis : Contenu de l'URL

📋 ACTION 9 : Obtenir la valeur
   Clé : content
   Depuis : Dictionnaire
   → Obtenir l'élément 0
   → Obtenir la valeur "text"

💭 ACTION 10 : Demander une entrée
   Question : "Veux-tu ajouter des notes ?"
   Type : Texte
   Multiligne : Oui

📝 ACTION 11 : Texte (Document final)
   # Vidéo YouTube
   
   ## Résumé
   [Action 9]
   
   ## Transcript
   [Retour à Action 4, obtenir formattedTranscript]
   
   ## Notes
   [Action 10]

📄 ACTION 12 : Créer document Craft
   (Via markdown_add ou URL Scheme)
```

### Version simplifiée (3 actions)

Si tu veux juste le transcript sans résumé :

```
1. Recevoir URL
2. GET vers ton API Netlify
3. Afficher le résultat
```

## ✅ Vérification rapide

Teste avec cette vidéo : https://www.youtube.com/watch?v=dQw4w9WgXcQ

### Test 1 : API fonctionne

Ouvre dans ton navigateur :
```
https://ton-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ
```

Tu dois voir du JSON avec le transcript ✅

### Test 2 : Interface web fonctionne

Ouvre :
```
https://ton-site.netlify.app
```

Clique sur "Tester l'API" ✅

### Test 3 : Raccourci iOS fonctionne

1. Copie l'URL YouTube
2. Lance ton raccourci
3. Un document Craft doit se créer ✅

## 🎯 Prochaines étapes

Une fois que tout fonctionne :

1. **Personnalise le template** : Édite `CONFIG_TEMPLATE.md`
2. **Ajoute des fonctionnalités** : Vignettes, chapitres, tags
3. **Optimise** : Ajoute du cache, gère les erreurs
4. **Partage** : Envoie le raccourci à tes amis !

## 🆘 Problèmes fréquents

### "Aucun sous-titre disponible"
→ La vidéo n'a pas de sous-titres. Essaye avec `lang=en`

### "Invalid API key" (Claude)
→ Vérifie ta clé API sur https://console.anthropic.com

### "Cannot read property..."
→ Vérifie que tu accèdes bien aux bonnes clés du dictionnaire

### Le raccourci est lent
→ Normal pour les longues vidéos. Ajoute une notification de progression

## 📚 Documentation complète

Pour aller plus loin :

- **README.md** : Documentation générale
- **IOS_SHORTCUT_GUIDE.md** : Guide détaillé du raccourci
- **CONFIG_TEMPLATE.md** : Personnalisation avancée
- **EXAMPLES.md** : Exemples de requêtes

## 💡 Astuces

### Raccourci clavier iOS

Configure ton raccourci pour qu'il apparaisse dans Share Sheet :
- Paramètres du raccourci > "Afficher dans la feuille de partage"
- Coché ✅ URLs

Maintenant depuis YouTube : Partager → Ton raccourci !

### Nom du document Craft

Récupère le titre de la vidéo :
```
1. GET https://www.youtube.com/oembed?url=[VIDEO_URL]&format=json
2. Obtenir la valeur "title"
3. Utilise ce titre pour ton document
```

### Badge de statut

Ajoute un badge dans ton README :

[![Netlify Status](https://api.netlify.com/api/v1/badges/TON-SITE-ID/deploy-status)](https://app.netlify.com/sites/TON-SITE/deploys)

## 🎉 C'est parti !

Tu es maintenant prêt à transformer n'importe quelle vidéo YouTube en notes structurées dans Craft !

Des questions ? Ouvre une issue sur GitHub ou contacte-moi.

Bon transcript ! 📹➡️📝
