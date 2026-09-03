import type { Category } from '../../types/index';

const categoryRules: Record<Category, string[]> = {
  'T-shirt': ['t-shirt', 'tee', 'tshirt', 'polo'],
  'Pull': ['pull', 'sweater', 'hoodie', 'sweat', 'crewneck', 'sweatshirt'],
  'Manteau': ['coat', 'jacket', 'veste', 'manteau', 'parka', 'puffer', 'windbreaker'],
  'Jean': ['jeans', 'denim'],
  'Jogging': ['jogger', 'sweatpants', 'tracksuit', 'jogging'],
  'Short': ['short', 'shorts', 'bermuda'],
  'Chaussure': ['shoe', 'sneaker', 'boots', 'chaussure', 'trainer', 'slides', 'sandals', 'jordan', 'yeezy'],
  'Bijou': ['ring', 'necklace', 'bracelet', 'jewelry', 'bague', 'collier'],
  'Montre': ['watch', 'rolex', 'montre', 'timepiece'],
  'Autre': []
};

export const guessCategory = (text: string): Category => {
  const normalizedText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryRules)) {
    if (keywords.some(keyword => normalizedText.includes(keyword))) {
      return category as Category;
    }
  }
  return 'Autre';
};