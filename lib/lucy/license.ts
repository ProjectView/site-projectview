// Logique metier licences (validation, activation, generation cle)
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return "LUCY-" + segment() + "-" + segment() + "-" + segment();
}

export async function validateLicense(key: string, fingerprint: string) {
  // TODO: Implémenter la validation complète
  return { valid: false };
}
