
'use server';
/**
 * @fileOverview A flow for listing resources from a GitHub repository.
 *
 * - listResources - A function that handles listing resources from GitHub.
 * - ListResourcesInput - The input type for the listResources function.
 * - ListResourcesOutput - The return type for the listResourcesOutput function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Octokit } from 'octokit';

const ListResourcesInputSchema = z.object({
  githubToken: z.string().describe('The GitHub personal access token.'),
  repository: z
    .string()
    .describe('The GitHub repository in the format "owner/repo".'),
  category: z.string().describe('The category (directory) to list resources from.'),
});
export type ListResourcesInput = z.infer<typeof ListResourcesInputSchema>;

const FileSchema = z.object({
  name: z.string(),
  size: z.string(),
  downloadUrl: z.string().nullable(),
});

const ResourceSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  subject: z.string().optional(),
  semester: z.string().optional(),
  year: z.string().optional(),
  keywords: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  downloads: z.number(),
  files: z.array(FileSchema),
  folderName: z.string(),
  downloadUrl: z.string().optional().nullable(),
});

const ListResourcesOutputSchema = z.array(ResourceSchema);
export type ListResourcesOutput = z.infer<typeof ListResourcesOutputSchema>;

export async function listResources(
  input: ListResourcesInput
): Promise<ListResourcesOutput> {
  return listResourcesFlow(input);
}

const listResourcesFlow = ai.defineFlow(
  {
    name: 'listResourcesFlow',
    inputSchema: ListResourcesInputSchema,
    outputSchema: ListResourcesOutputSchema,
  },
  async (input) => {
    const octokit = new Octokit({ auth: input.githubToken });
    const [owner, repo] = input.repository.split('/');

    try {
      // Get default branch
      let defaultBranchName: string;
      try {
        const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
        defaultBranchName = repoData.default_branch;
      } catch (e: any) {
        if (e?.status === 404) {
          console.warn(`Repository "${input.repository}" not found.`);
          return [];
        }
        console.error('Failed to get repository data from GitHub.', e);
        throw new Error('Failed to get repository data from GitHub.');
      }

      // Get latest commit SHA
      const { data: branchData } = await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch: defaultBranchName,
      });
      const latestCommitSha = branchData.commit.sha;

      // Get full tree
      const { data: tree } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: latestCommitSha,
        recursive: '1',
      });

      if (!tree.tree) return [];

      // Find metadata.json files
      const metadataFiles = tree.tree.filter(
        (file) =>
          file.type === 'blob' &&
          file.path?.startsWith(input.category + '/') &&
          file.path.endsWith('/metadata.json')
      );

      const fileShas = new Set(
        metadataFiles.map((f) => f.sha).filter(Boolean) as string[]
      );

      // Fetch metadata blobs
      const blobResults = await Promise.all(
        Array.from(fileShas).map((file_sha) =>
          octokit.rest.git.getBlob({ owner, repo, file_sha })
        )
      );

      const metadataBySha: Record<string, any> = {};
      blobResults.forEach((res) => {
        if (res.data.sha) {
          metadataBySha[res.data.sha] = JSON.parse(
            Buffer.from(res.data.content, 'base64').toString('utf-8')
          );
        }
      });

      // Collect all non-metadata files
      const allFilesByFolder: Record<string, any[]> = {};
      tree.tree.forEach((file) => {
        if (file.type === 'blob' && file.path && !file.path.endsWith('metadata.json')) {
          const folderPath = file.path.substring(0, file.path.lastIndexOf('/'));
          if (!allFilesByFolder[folderPath]) {
            allFilesByFolder[folderPath] = [];
          }
          allFilesByFolder[folderPath].push(file);
        }
      });

      // Build resources
      const rawResources = metadataFiles
        .map((metadataFile) => {
          if (!metadataFile.path || !metadataFile.sha) return null;

          const folderPath = metadataFile.path.substring(
            0,
            metadataFile.path.lastIndexOf('/')
          );
          const folderName = folderPath.substring(
            folderPath.lastIndexOf('/') + 1
          );
          const metadata = metadataBySha[metadataFile.sha];
          if (!metadata) return null;

          const resourceFiles = allFilesByFolder[folderPath] || [];

          const files = resourceFiles.map((file) => ({
            name: file.path?.substring(folderPath.length + 1) || '',
            size: `${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`,
            downloadUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranchName}/${file.path}`,
          }));

          const now = new Date().toISOString();
          const creationDate = metadata.createdAt || metadata.date || now;

          return {
            title: metadata.title || folderName.replace(/[-_]/g, ' '),
            description: metadata.description || 'No description available.',
            tags: metadata.tags || [input.category],
            subject: metadata.subject,
            semester: metadata.semester,
            year: metadata.year,
            keywords: metadata.keywords || [],
            createdAt: creationDate,
            updatedAt: metadata.updatedAt || creationDate,
            downloads: 0,
            folderName,
            downloadUrl: metadata.downloadUrl,
            files,
          };
        })
        .filter((r): r is ListResourcesOutput[0] => r !== null);

      // Merge by title
      const merged: Record<string, ListResourcesOutput[0]> = {};
      for (const resource of rawResources) {
        const key = resource.title.toLowerCase();
        if (!merged[key]) {
          merged[key] = resource;
        } else {
          const existingFiles = new Set(merged[key].files.map((f) => f.name));
          resource.files.forEach((f) => {
            if (!existingFiles.has(f.name)) merged[key].files.push(f);
          });

          const existingTags = new Set(merged[key].tags);
          resource.tags.forEach((t) => {
            if (!existingTags.has(t)) merged[key].tags.push(t);
          });
        }
      }

      const finalResources = Object.values(merged);
      finalResources.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return finalResources;
    } catch (error: any) {
      if (error?.status === 404) {
        console.warn(
          `Category "${input.category}" not found in repository, or repository is empty.`
        );
        return [];
      }

      console.error(
        'Failed to list resources from GitHub. This is likely due to an invalid or missing GITHUB_TOKEN on the server.',
        error
      );

      throw new Error('Failed to list resources from GitHub.');
    }
  }
);
