import { parseYupooHTML, type ScrapedData } from './yupooParser';

// Proxy public (AllOrigins) pour contourner le CORS depuis GitHub Pages
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export const fetchYupooData = async (yupooUrl: string): Promise<ScrapedData | null> => {
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(yupooUrl)}`);
    if (!response.ok) throw new Error('Erreur réseau');
    
    const data = await response.json();
    if (!data.contents) throw new Error('HTML vide');
    
    return parseYupooHTML(data.contents);
  } catch (error) {
    console.warn("Échec du scraping Yupoo (probablement bloqué par CORS/Protection). Bascule en mode manuel.", error);
    return null;
  }
};