const https = require('https');
const { URLSearchParams } = require('url');

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

// Fonction pour récupérer le transcript via l'API interne de YouTube
async function fetchTranscript(videoId, lang = 'fr') {
  return new Promise((resolve, reject) => {
    // Étape 1 : Récupérer la page vidéo pour obtenir les métadonnées
    const options = {
      hostname: 'www.youtube.com',
      path: `/watch?v=${videoId}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Extraire les données de configuration de la page
          const captionsMatch = data.match(/"captionTracks":(\[.*?\])/);
          
          if (!captionsMatch) {
            reject(new Error('Aucun sous-titre disponible pour cette vidéo'));
            return;
          }
          
          const captionTracks = JSON.parse(captionsMatch[1]);
          
          // Chercher le sous-titre dans la langue demandée, sinon prendre le premier disponible
          let captionTrack = captionTracks.find(track => track.languageCode === lang);
          if (!captionTrack) {
            captionTrack = captionTracks.find(track => track.languageCode.startsWith(lang.split('-')[0]));
          }
          if (!captionTrack) {
            captionTrack = captionTracks[0]; // Fallback sur le premier disponible
          }
          
          const captionUrl = captionTrack.baseUrl;
          
          // Étape 2 : Récupérer le transcript XML
          https.get(captionUrl, (captionRes) => {
            let captionData = '';
            
            captionRes.on('data', (chunk) => {
              captionData += chunk;
            });
            
            captionRes.on('end', () => {
              // Parser le XML et extraire le texte avec timestamps
              const textRegex = /<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]+)<\/text>/g;
              const transcript = [];
              let match;
              
              while ((match = textRegex.exec(captionData)) !== null) {
                const startTime = parseFloat(match[1]);
                const text = match[3]
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/\n/g, ' ')
                  .trim();
                
                if (text) {
                  transcript.push({
                    start: startTime,
                    text: text
                  });
                }
              }
              
              resolve(transcript);
            });
          }).on('error', reject);
          
        } catch (error) {
          reject(new Error('Erreur lors du parsing des sous-titres: ' + error.message));
        }
      });
    }).on('error', reject);
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
    
    const { url, videoId, lang = 'fr', format = 'detailed' } = params;
    
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
        message: error.message,
        details: error.stack
      })
    };
  }
};
