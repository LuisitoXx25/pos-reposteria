import { createBrowserClient } from "@supabase/ssr";

// Este cliente se usa en componentes del lado del cliente ("use client")
// createBrowserClient maneja automáticamente las cookies de sesión en el browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
