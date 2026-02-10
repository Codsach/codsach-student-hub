
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
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
        
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const recent = allFetchedResources
            .filter(r => new Date(r.createdAt) > threeDaysAgo)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        return recent;

    } catch (error) {
        console.error("Could not fetch recent resources in app layout:", error);
        // Return an empty array on error to prevent crashing the layout
        return [];
    }
}


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
