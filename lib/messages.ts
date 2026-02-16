import fs from 'fs';
import path from 'path';

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  solution: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json');

function readMessages(): Message[] {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeMessages(messages: Message[]): void {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

export async function getAllMessages(): Promise<Message[]> {
  return readMessages().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getMessageById(id: string): Promise<Message | null> {
  const messages = readMessages();
  return messages.find((m) => m.id === id) || null;
}

export async function getUnreadCount(): Promise<number> {
  const messages = readMessages();
  return messages.filter((m) => !m.read).length;
}

export async function createMessage(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  solution?: string;
  message: string;
}): Promise<Message> {
  const messages = readMessages();

  const newMessage: Message = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    company: data.company || '',
    solution: data.solution || '',
    message: data.message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  writeMessages(messages);
  return newMessage;
}

export async function markMessageAsRead(id: string): Promise<boolean> {
  const messages = readMessages();
  const msg = messages.find((m) => m.id === id);
  if (!msg) return false;
  msg.read = true;
  writeMessages(messages);
  return true;
}

export async function markMessageAsUnread(id: string): Promise<boolean> {
  const messages = readMessages();
  const msg = messages.find((m) => m.id === id);
  if (!msg) return false;
  msg.read = false;
  writeMessages(messages);
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const messages = readMessages();
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;
  writeMessages(filtered);
  return true;
}
