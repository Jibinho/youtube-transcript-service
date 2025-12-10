const https = require('https');

// Fonction pour extraire l'ID vidéo YouTube depuis différents formats d'URL
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // ID direct
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// Fonction pour décoder les entités HTML
function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fonction pour récupérer le transcript via l'API interne de YouTube
async function fetchTranscript(videoId, lang = 'en') {
  return new Promise((resolve, reject) => {
    // Étape 1 : Récupérer la page vidéo pour obtenir les métadonnées
    const options = {
      hostname: 'www.youtube.com',
      path: `/watch?v=${videoId}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };

    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Chercher ytInitialPlayerResponse qui contient toutes les données
          const playerResponseMatch = data.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
          
          if (!playerResponseMatch) {
            reject(new Error('Impossible de trouver les données de la vidéo'));
            return;
          }
          
          let playerResponse;
          try {
            playerResponse = JSON.parse(playerResponseMatch[1]);
          } catch (e) {
            reject(new Error('Erreur de parsing des données vidéo'));
            return;
          }
          
          // Extraire les captions
          const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
          
          if (!captions || !Array.isArray(captions) || captions.length === 0) {
            reject(new Error('Aucun sous-titre disponible pour cette vidéo'));
            return;
          }
          
          // Stratégie de sélection des sous-titres
          let selectedCaption = null;
          
          // 1. Chercher la langue exacte demandée
          selectedCaption = captions.find(track => track.languageCode === lang);
          
          // 2. Chercher la langue de base (ex: 'fr' dans 'fr-FR')
          if (!selectedCaption) {
            const baseLang = lang.split('-')[0];
            selectedCaption = captions.find(track => track.languageCode.startsWith(baseLang));
          }
          
          // 3. Chercher dans vssId (identifiant des sous-titres auto)
          if (!selectedCaption) {
            selectedCaption = captions.find(track => 
              track.vssId && (
                track.vssId.includes(`.${lang}`) ||
                track.vssId.includes(`a.${lang}`)
              )
            );
          }
          
          // 4. Si langue = fr et pas trouvé, essayer en
          if (!selectedCaption && lang === 'fr') {
            selectedCaption = captions.find(track => 
              track.languageCode === 'en' || 
              track.languageCode.startsWith('en')
            );
          }
          
          // 5. Prendre le premier disponible en dernier recours
          if (!selectedCaption) {
            selectedCaption = captions[0];
          }
          
          const captionUrl = selectedCaption.baseUrl;
          
          if (!captionUrl) {
            reject(new Error('URL des sous-titres introuvable'));
            return;
          }
          
          // Étape 2 : Récupérer le transcript XML
          https.get(captionUrl, (captionRes) => {
            let captionData = '';
            
            captionRes.on('data', (chunk) => {
              captionData += chunk;
            });
            
            captionRes.on('end', () => {
              try {
                // Parser le XML - Nouvelle approche plus robuste
                const transcript = [];
                
                // Extraire tous les éléments <text>
                const textMatches = captionData.matchAll(/<text[^>]*start="([^"]*)"[^>]*>(.*?)<\/text>/gs);
                
                for (const match of textMatches) {
                  const startTime = parseFloat(match[1]);
                  let text = match[2];
                  
                  // Décoder les entités HTML
                  text = decodeHtmlEntities(text);
                  
                  if (text && text.length > 0) {
                    transcript.push({
                      start: startTime,
                      text: text
                    });
                  }
                }
                
                if (transcript.length === 0) {
                  reject(new Error('Impossible de parser les sous-titres (0 entrées)'));
                  return;
                }
                
                resolve(transcript);
              } catch (error) {
                reject(new Error('Erreur lors du parsing XML: ' + error.message));
              }
            });
          }).on('error', (error) => {
            reject(new Error('Erreur lors du téléchargement des sous-titres: ' + error.message));
          });
          
        } catch (error) {
          reject(new Error('Erreur lors de l\'extraction des métadonnées: ' + error.message));
        }
      });
    }).on('error', (error) => {
      reject(new Error('Erreur de connexion YouTube: ' + error.message));
    });
  });
}

// Formater le temps en HH:MM:SS
function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

exports.handler = async (event) => {
  // Gérer CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Récupérer les paramètres
    const params = event.httpMethod === 'GET' 
      ? event.queryStringParameters 
      : JSON.parse(event.body || '{}');
    
    const { url, videoId, lang = 'en', format = 'detailed' } = params;
    
    // Extraire l'ID vidéo
    const id = videoId || extractVideoId(url);
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'URL YouTube invalide ou ID vidéo manquant',
          message: 'Veuillez fournir une URL YouTube valide ou un ID vidéo'
        })
      };
    }

    // Récupérer le transcript
    const transcript = await fetchTranscript(id, lang);
    
    if (transcript.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Aucun transcript trouvé',
          message: 'Cette vidéo ne contient pas de sous-titres'
        })
      };
    }

    // Formater selon le format demandé
    let response = {
      videoId: id,
      language: lang,
      entryCount: transcript.length
    };

    if (format === 'detailed') {
      // Format avec timestamps
      response.transcript = transcript.map(entry => ({
        timestamp: formatTimestamp(entry.start),
        seconds: entry.start,
        text: entry.text
      }));
      
      // Texte complet avec timestamps pour affichage
      response.formattedTranscript = transcript
        .map(entry => `[${formatTimestamp(entry.start)}] ${entry.text}`)
        .join('\n');
        
      // Texte brut sans timestamps (utile pour le résumé)
      response.plainText = transcript
        .map(entry => entry.text)
        .join(' ');
        
    } else if (format === 'plain') {
      // Format texte simple uniquement
      response.text = transcript
        .map(entry => entry.text)
        .join(' ');
        
    } else if (format === 'timestamped') {
      // Format avec timestamps uniquement
      response.text = transcript
        .map(entry => `[${formatTimestamp(entry.start)}] ${entry.text}`)
        .join('\n');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur lors de la récupération du transcript',
        message: error.message
      })
    };
  }
};
