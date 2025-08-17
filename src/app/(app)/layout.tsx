import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Suspense } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/20 w-full">
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
