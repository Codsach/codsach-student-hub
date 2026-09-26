import { Octokit } from 'octokit';
import { unstable_cache } from 'next/cache';

export interface LiveStats {
  totalResources: number;
  totalFiles: number;
  storageMB: number;
  subjectsCount: number;
}

const DEFAULT_STATS: LiveStats = {
  totalResources: 27,
  totalFiles: 120,
  storageMB: 50,
  subjectsCount: 5,
};

async function fetchGitHubStats(): Promise<LiveStats> {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'Codsach';
  const repo = 'codsach-resources';

  const tryFetch = async (auth?: string) => {
    const octokit = new Octokit(auth ? { auth } : {});
    const repoData = await octokit.rest.repos.get({ owner, repo });
    const defaultBranch = repoData.data.default_branch || 'main';
    
    const treeData = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: 'true',
    });

    const tree = treeData.data.tree;
    const metadataBlobs = tree.filter(
      (item) => item.type === 'blob' && item.path?.endsWith('metadata.json')
    );
    const studyFiles = tree.filter(
      (item) =>
        item.type === 'blob' &&
        !item.path?.endsWith('metadata.json') &&
        !item.path?.endsWith('.gitkeep') &&
        !item.path?.endsWith('README.md')
    );

    const storageMB = Math.max(1, Math.round(repoData.data.size / 1024));
    const totalResources = metadataBlobs.length;
    const totalFiles = studyFiles.length;

    // Extract subjects from paths or default known subjects
    const subjectSet = new Set<string>();
    metadataBlobs.forEach((item) => {
      if (item.path) {
        const parts = item.path.split('/');
        if (parts.length > 1) {
          // Add category or folder name
          subjectSet.add(parts[0]);
        }
      }
    });

    return {
      totalResources: totalResources > 0 ? totalResources : DEFAULT_STATS.totalResources,
      totalFiles: totalFiles > 0 ? totalFiles : DEFAULT_STATS.totalFiles,
      storageMB: storageMB > 0 ? storageMB : DEFAULT_STATS.storageMB,
      subjectsCount: Math.max(5, subjectSet.size),
    };
  };

  try {
    // Attempt with token first if available
    return await tryFetch(token);
  } catch (_error) {
    console.warn('GitHub token was unauthorized or expired, falling back to public GitHub request.');
    try {
      return await tryFetch();
    } catch (_unauthError) {
      console.warn('Public GitHub request failed, using fallback stats.');
      return DEFAULT_STATS;
    }
  }
}

export const getLiveRepoStats = unstable_cache(
  async () => fetchGitHubStats(),
  ['codsach-github-repo-stats'],
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['repo-stats'],
  }
);
