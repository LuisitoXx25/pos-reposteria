import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--dolci-crema)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo centrado */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Dolci Enid"
            width={160}
            height={160}
            className="rounded-full"
            priority
          />
        </div>
        {children}
      </div>
    </div>
  );
}