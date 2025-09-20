import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext';
import Header from '../components/Header'
import Cart from "@/components/Cart";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "O'Boricienne Burger - Restaurant Évreux",
  description: 'Découvrez nos smash burgers artisanaux près du Bâtiment CFA d\'Évreux. Commandez en ligne et dégustez l\'art du burger street food.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Cart />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
