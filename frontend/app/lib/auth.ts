import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * Checks if user is authenticated by looking for session_id cookie
 * @returns true if session_id cookie exists, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session_id');
  return !!sessionCookie;
}

/**
 * Requires authentication. If not authenticated, redirects to login.
 * Use in Server Components at the top of the component.
 */
export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login');
  }
}
