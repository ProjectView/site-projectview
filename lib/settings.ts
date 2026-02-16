import fs from 'fs';
import path from 'path';

export interface SiteSettings {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    analyticsId: string;
  };
  integrations: {
    n8nWebhook: string;
    githubConnected: boolean;
    netlifyConnected: boolean;
  };
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'site-settings.json');

const DEFAULT_SETTINGS: SiteSettings = {
  company: {
    name: 'Projectview',
    email: 'contact@projectview.fr',
    phone: '0 777 300 658',
    address: '6 rue de Genève, 69800 Saint Priest',
    website: 'https://projectview.fr',
  },
  social: {
    linkedin: '',
    twitter: '',
    instagram: '',
    youtube: '',
  },
  seo: {
    defaultTitle: "Projectview — La technologie au service de l'émotion",
    defaultDescription: 'Nous transformons vos espaces physiques en environnements interactifs qui captivent, engagent et convertissent.',
    analyticsId: '',
  },
  integrations: {
    n8nWebhook: '',
    githubConnected: false,
    netlifyConnected: false,
  },
};

export function getSiteSettings(): SiteSettings {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Deep merge with defaults to handle missing fields
    return {
      company: { ...DEFAULT_SETTINGS.company, ...parsed.company },
      social: { ...DEFAULT_SETTINGS.social, ...parsed.social },
      seo: { ...DEFAULT_SETTINGS.seo, ...parsed.seo },
      integrations: { ...DEFAULT_SETTINGS.integrations, ...parsed.integrations },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const updated: SiteSettings = {
    company: { ...current.company, ...(settings.company || {}) },
    social: { ...current.social, ...(settings.social || {}) },
    seo: { ...current.seo, ...(settings.seo || {}) },
    integrations: { ...current.integrations, ...(settings.integrations || {}) },
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
