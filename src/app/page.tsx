
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Stats } from '@/components/landing/stats';
import { Resources } from '@/components/landing/resources';
import { Benefits } from '@/components/landing/benefits';
import { Cta } from '@/components/landing/cta';
import { Suspense } from 'react';
import { getRecentResources, getCategoryResourceStats } from '@/lib/resources';
import { getLiveRepoStats } from '@/lib/github-stats';


export default async function Home() {
  const [recentResources, liveStats, categoryStats] = await Promise.all([
    getRecentResources(),
    getLiveRepoStats(),
    getCategoryResourceStats(),
  ]);

  return (
    <div className="flex flex-col min-h-dvh bg-background w-full">
      <Suspense>
        <Header recentResources={recentResources} />
      </Suspense>
      <main className="flex-grow">
        <Hero />
        <Stats stats={liveStats} />
        <Resources categoryStats={categoryStats} />
        <Benefits />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
