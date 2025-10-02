'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/Header';
import Cart from "@/components/Cart";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isAdminPage && <Cart />}
    </>
  );
}
