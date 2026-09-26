
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Suspense } from 'react';
import { getRecentResources } from '@/lib/resources';


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recentResources = await getRecentResources();

  return (
    <div className="flex flex-col min-h-dvh bg-muted/20 w-full">
      <Suspense>
        <Header recentResources={recentResources} />
      </Suspense>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
