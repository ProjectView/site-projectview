'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin/dashboard',
    });
  } catch (error) {
    // next-auth throws NEXT_REDIRECT on success — must re-throw it
    if (error instanceof AuthError) {
      return { error: 'Email ou mot de passe incorrect.' };
    }
    throw error;
  }
}
