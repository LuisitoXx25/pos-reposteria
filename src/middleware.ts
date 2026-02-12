import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// El middleware se ejecuta ANTES de cada request.
// Piénsalo como un guardia de seguridad en la puerta:
// 1. Refresca la sesión (para que no expire mientras el usuario navega)
// 2. Si el usuario NO está logueado y quiere entrar a una ruta protegida → lo manda al login
// 3. Si el usuario SÍ está logueado y quiere ir al login → lo manda al dashboard

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refrescar la sesión (importante: no quitar esta línea)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/registro");

  // Si NO hay usuario y la ruta NO es de auth → redirigir al login
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si SÍ hay usuario y la ruta ES de auth → redirigir al dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// Configuración: en qué rutas se ejecuta el middleware
// Excluimos archivos estáticos, imágenes, favicon, etc.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
