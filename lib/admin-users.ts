import fs from 'fs';
import path from 'path';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'admin-users.json');

function readUsers(): AdminUser[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeUsers(users: AdminUser[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  const users = readUsers();
  return users.find((u) => u.id === id) || null;
}

export async function getAllAdmins(): Promise<Omit<AdminUser, 'passwordHash'>[]> {
  const users = readUsers();
  return users.map(({ passwordHash: _, ...rest }) => rest);
}

export async function createAdmin(
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'editor' = 'admin'
): Promise<Omit<AdminUser, 'passwordHash'>> {
  const bcrypt = await import('bcryptjs');
  const users = readUsers();

  // Check duplicate email
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Un utilisateur avec cet email existe déjà.');
  }

  const newUser: AdminUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 12),
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  const { passwordHash: _, ...safe } = newUser;
  return safe;
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const users = readUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  if (filtered.length === 0) throw new Error('Impossible de supprimer le dernier administrateur.');
  writeUsers(filtered);
  return true;
}

export async function updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  const users = readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return false;
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  writeUsers(users);
  return true;
}
