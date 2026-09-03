export interface ScrapedData {
  title: string;
  seller: string;
  images: string[];
}

export const parseYupooHTML = (html: string): ScrapedData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // 1. Extraction du Titre
  let title = doc.querySelector('title')?.textContent || '';
  title = title.replace('| Yupoo', '').trim();
  
  // 2. Extraction du Vendeur (Souvent dans un lien de profil)
  let seller = doc.querySelector('.showuser__name')?.textContent?.trim() || '';
  if (!seller) {
    const headerName = doc.querySelector('.showheader__title')?.textContent?.trim();
    seller = headerName || 'Vendeur inconnu';
  }

  // 3. Extraction des Images (Yupoo utilise souvent data-origin-src pour le lazy loading)
  const images: string[] = [];
  const imageElements = doc.querySelectorAll('.image__main, img[data-origin-src], img.image__img');
  
  imageElements.forEach((img) => {
    const src = img.getAttribute('data-origin-src') || img.getAttribute('src');
    if (src && src.includes('yupoo.com') && !src.includes('favicon')) {
      // Nettoyage de l'URL
      let cleanSrc = src.startsWith('//') ? `https:${src}` : src;
      if (!images.includes(cleanSrc)) {
        images.push(cleanSrc);
      }
    }
  });

  return { title, seller, images };
};