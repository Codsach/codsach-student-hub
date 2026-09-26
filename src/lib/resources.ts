import { listResources, type ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { unstable_cache } from 'next/cache';

const CATEGORIES = ['notes', 'lab-programs', 'question-papers', 'software-tools'];
const REPOSITORY = 'Codsach/codsach-resources';

async function fetchRecentResources(limit: number = 8): Promise<ListResourcesOutput> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;

    const resourcePromises = CATEGORIES.map(category =>
      listResources({
        githubToken,
        repository: REPOSITORY,
        category,
      }).catch(err => {
        console.error(`Failed to list resources for category "${category}":`, err?.message || err);
        return [];
      })
    );

    const results = await Promise.all(resourcePromises);
    const all = results.flat();

    // Sort by createdAt descending
    const sorted = all.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sorted.slice(0, limit);
  } catch (error) {
    console.error('Could not fetch recent resources:', error);
    return [];
  }
}

export const getRecentResources = unstable_cache(
  async (limit: number = 8) => fetchRecentResources(limit),
  ['codsach-recent-resources'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['recent-resources'],
  }
);
