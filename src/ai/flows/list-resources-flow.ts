
'use server';
/**
 * @fileOverview A flow for listing resources from a GitHub repository.
 *
 * - listResources - A function that handles listing resources from GitHub.
 * - ListResourcesInput - The input type for the listResources function.
 * - ListResourcesOutput - The return type for the listResources function.
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
    date: z.string(),
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
      // 1. Get the SHA of the latest commit on the main branch
      const { data: branch } = await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch: 'main', // Or your default branch
      });
      const latestCommitSha = branch.commit.sha;

      // 2. Get the entire repository tree recursively in a single call
      const { data: tree } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: latestCommitSha,
        recursive: '1',
      });

      if (!tree.tree) {
        return [];
      }
      
      // 3. Filter the tree to find metadata.json files within the specified category
      const metadataFiles = tree.tree.filter(
        (file) => file.path?.startsWith(input.category + '/') && file.path.endsWith('/metadata.json')
      );

      // 4. Process each resource in parallel
      const resources = await Promise.all(
        metadataFiles.map(async (metadataFile) => {
          try {
            if (!metadataFile.path || !metadataFile.sha) return null;

            const folderPath = metadataFile.path.substring(0, metadataFile.path.lastIndexOf('/'));
            const folderName = folderPath.substring(folderPath.lastIndexOf('/') + 1);

            // Fetch metadata content
            const { data: metadataContent } = await octokit.rest.git.getBlob({
              owner,
              repo,
              file_sha: metadataFile.sha,
            });
            const metadata = JSON.parse(Buffer.from(metadataContent.content, 'base64').toString('utf-8'));

            // Find all files belonging to this resource from the full tree
            const resourceFilesData = tree.tree.filter(
              (file) => file.path?.startsWith(folderPath + '/') && !file.path.endsWith('metadata.json') && file.type === 'blob'
            );
            
            // Get last commit date for the metadata file
            const commitResponse = await octokit.rest.repos.listCommits({
                owner,
                repo,
                path: metadataFile.path,
                per_page: 1,
            });
            const lastCommit = commitResponse.data[0];
            const date = lastCommit ? new Date(lastCommit.commit.author?.date!).toLocaleDateString() : new Date().toLocaleDateString();

            const files: z.infer<typeof FileSchema>[] = resourceFilesData.map(file => ({
                name: file.path?.substring(folderPath.length + 1) || '',
                size: `${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`,
                downloadUrl: `https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`
            }));
            
            return {
              title: metadata.title || folderName.replace(/[-_]/g, ' '),
              description: metadata.description || 'No description available.',
              tags: metadata.tags || [input.category],
              subject: metadata.subject,
              semester: metadata.semester,
              year: metadata.year,
              keywords: metadata.keywords || [],
              date: date,
              downloads: 0, // Placeholder
              folderName: folderName,
              downloadUrl: metadata.downloadUrl,
              files: files,
            };
          } catch (e) {
            console.error(`Error processing resource for ${metadataFile.path}:`, e);
            return null;
          }
        })
      );

      return resources.filter((r): r is ListResourcesOutput[0] => r !== null);

    } catch (error: any) {
       if (error.status === 404) {
        console.warn(`Category "${input.category}" not found or repository is empty.`);
        return []; 
      }
      console.error('Failed to list resources from GitHub:', error);
      return []; // Return empty on other errors to prevent site crash
    }
  }
);
