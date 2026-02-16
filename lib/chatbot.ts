import fs from 'fs';
import path from 'path';

export interface ChatbotConfig {
  enabled: boolean;
  welcomeMessage: string;
  systemPrompt: string;
  model: string;
  position: 'bottom-right' | 'bottom-left';
  accentColor: string;
  maxTokens: number;
  temperature: number;
}

const CONFIG_FILE = path.join(process.cwd(), 'data', 'chatbot-config.json');

const DEFAULT_CONFIG: ChatbotConfig = {
  enabled: false,
  welcomeMessage: "Bonjour ! Je suis l'assistant Projectview. Comment puis-je vous aider ?",
  systemPrompt: "Tu es l'assistant virtuel de Projectview, une entreprise française spécialisée dans la transformation des espaces physiques en expériences interactives. Tu aides les visiteurs du site à comprendre nos solutions. Tu réponds en français, de manière professionnelle et chaleureuse.",
  model: 'gpt-4o-mini',
  position: 'bottom-right',
  accentColor: '#3B7A8C',
  maxTokens: 500,
  temperature: 0.7,
};

export function getChatbotConfig(): ChatbotConfig {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveChatbotConfig(config: Partial<ChatbotConfig>): ChatbotConfig {
  const current = getChatbotConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
