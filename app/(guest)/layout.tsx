import Link from "next/link";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <span className="text-lg font-semibold">Grand Raya Hotel</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/rooms" className="text-muted-foreground hover:text-foreground">
              Rooms
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
