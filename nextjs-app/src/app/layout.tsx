import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ProTasker",
  description: "Tasks managment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav
            aria-label="Global"
            className="bg-nav-btn-color mx-auto flex items-center justify-between p-6 lg:px-8"
          >
            <div className="flex">
              <Link href="/" className="text-yellow-600 font-bold text-lg">
                ProTasker
              </Link>
            </div>
            <div className="flex">
              <Link href="/tasks" className="text-yellow-600 font-bold">
                Tâches
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
