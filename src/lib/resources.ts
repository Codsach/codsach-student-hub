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

export interface CategoryStat {
  key: string;
  title: string;
  description: string;
  count: number;
  countLabel: string;
  href: string;
}

const CATEGORY_CONFIGS = [
  {
    key: 'lab-programs',
    title: 'Lab Programs',
    description: 'Complete lab programs with source code and explanations',
    unitName: 'Program',
    href: '/lab-programs',
  },
  {
    key: 'notes',
    title: 'Study Notes',
    description: 'Comprehensive notes for all MCA subjects',
    unitName: 'Note',
    href: '/notes',
  },
  {
    key: 'question-papers',
    title: 'Question Papers',
    description: 'Previous year question papers and solutions',
    unitName: 'Paper',
    href: '/question-papers',
  },
  {
    key: 'software-tools',
    title: 'Software Tools',
    description: 'Essential software and development tools',
    unitName: 'Tool',
    href: '/software-tools',
  },
];

async function fetchCategoryResourceStats(): Promise<CategoryStat[]> {
  const githubToken = process.env.GITHUB_TOKEN;

  const results = await Promise.all(
    CATEGORY_CONFIGS.map(async (cat) => {
      try {
        const resources = await listResources({
          githubToken,
          repository: REPOSITORY,
          category: cat.key,
        });
        const count = resources.length;
        const countLabel = count === 1 ? `1 ${cat.unitName}` : `${count} ${cat.unitName}s`;
        return {
          key: cat.key,
          title: cat.title,
          description: cat.description,
          count,
          countLabel,
          href: cat.href,
        };
      } catch (err) {
        console.error(`Failed to fetch category stats for ${cat.key}:`, err);
        return {
          key: cat.key,
          title: cat.title,
          description: cat.description,
          count: 0,
          countLabel: `0 ${cat.unitName}s`,
          href: cat.href,
        };
      }
    })
  );

  return results;
}

export const getCategoryResourceStats = unstable_cache(
  async () => fetchCategoryResourceStats(),
  ['codsach-category-resource-stats'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['category-stats'],
  }
);

