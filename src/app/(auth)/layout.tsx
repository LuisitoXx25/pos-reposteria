// Layout compartido para las rutas de auth (login y registro)
// Este layout NO tiene sidebar ni navbar, solo centra el contenido
// en la pantalla. El route group (auth) hace que esta URL no aparezca
// en la ruta: /login en vez de /(auth)/login

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}