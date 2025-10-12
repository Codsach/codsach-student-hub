
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Stats } from '@/components/landing/stats';
import { Resources } from '@/components/landing/resources';
import { Benefits } from '@/components/landing/benefits';
import { Cta } from '@/components/landing/cta';
import { Suspense } from 'react';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';

async function getRecentResources() {
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            console.error("Server configuration error: GITHUB_TOKEN is not set. Recent resources will not be fetched.");
            return [];
        }

        const categories = ['notes', 'lab-programs', 'question-papers', 'software-tools'];
        const resourcePromises = categories.map(category => 
            listResources({
                githubToken,
                repository: 'Codsach/codsach-resources',
                category,
            })
        );
        const results = await Promise.all(resourcePromises);
        const allFetchedResources = results.flat();
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recent = allFetchedResources
            .filter(r => new Date(r.date) > sevenDaysAgo)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return recent;

    } catch (error) {
        console.error("Could not fetch recent resources in page layout:", error);
        return [];
    }
}


export default async function Home() {
  const recentResources = await getRecentResources();

  return (
    <div className="flex flex-col min-h-dvh bg-background w-full">
      <Suspense>
        <Header recentResources={recentResources} />
      </Suspense>
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Resources />
        <Benefits />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
