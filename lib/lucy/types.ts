// Types TypeScript Lucy (backend)
export interface License {
  id: string;
  key: string;
  type: 'trial' | 'subscription';
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  clientId: string;
  fingerprint: string;
  deviceName: string;
  deviceOS: 'windows' | 'android' | 'macos';
  createdAt: Date;
  activatedAt?: Date;
  expiresAt: Date;
  lastValidation?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  email: string;
}

export interface Meeting {
  id: string;
  licenseId: string;
  clientId: string;
  date: Date;
  duration: number;
  language: 'fr' | 'en';
  status: 'recording' | 'processing' | 'completed' | 'failed';
  participants: string[];
  sources: { audio: boolean; camera: boolean; screen: boolean };
  autoStopMinutes: number;
  transcript?: any;
  report?: MeetingReport;
  files?: MeetingFiles;
  offlineMode: boolean;
  syncedAt?: Date;
}

export interface MeetingReport {
  summary: string;
  participants: { speaker: string; name?: string; role?: string }[];
  topics: { title: string; discussion: string; keyPoints: string[] }[];
  decisions: { decision: string; proposedBy: string; approvedBy?: string }[];
  actions: { action: string; assignedTo: string; deadline?: string; priority?: string }[];
  nextSteps: string[];
  notes?: string;
}

export interface MeetingFiles {
  audio?: string;
  camera?: string;
  screen?: string;
  reportPdf?: string;
}

export interface Device {
  id: string;
  fingerprint: string;
  name: string;
  os: string;
  licenseId: string;
  appVersion: string;
  lastSeen: Date;
  whisperModelInstalled: boolean;
}
