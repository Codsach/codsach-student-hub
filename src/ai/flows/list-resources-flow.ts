
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
        (file) => file.path?.startsWith(input.category + '/') && file.path.endsWith('/metadata.json') && file.type === 'blob'
      );
      
      const fileShas = new Set(metadataFiles.map(f => f.sha).filter(Boolean) as string[]);

      // 4. Fetch all metadata blobs in parallel - THIS IS THE KEY OPTIMIZATION
      const blobPromises = Array.from(fileShas).map(file_sha => 
        octokit.rest.git.getBlob({ owner, repo, file_sha })
      );
      const blobResults = await Promise.all(blobPromises);
      
      const metadataBySha: Record<string, any> = {};
      blobResults.forEach(response => {
        const sha = response.data.sha;
        if (sha) {
            metadataBySha[sha] = JSON.parse(Buffer.from(response.data.content, 'base64').toString('utf-8'));
        }
      });

      // 5. Process all files into a structured map for efficient lookup
      const allFilesByFolder: Record<string, any[]> = {};
       tree.tree.forEach(file => {
          if (file.path && file.type === 'blob' && !file.path.endsWith('metadata.json')) {
              const folderPath = file.path.substring(0, file.path.lastIndexOf('/'));
              if (!allFilesByFolder[folderPath]) {
                  allFilesByFolder[folderPath] = [];
              }
              allFilesByFolder[folderPath].push(file);
          }
      });
      
      // 6. Construct the raw resources array
      const rawResources = metadataFiles.map(metadataFile => {
        if (!metadataFile.path || !metadataFile.sha) return null;
        
        const folderPath = metadataFile.path.substring(0, metadataFile.path.lastIndexOf('/'));
        const folderName = folderPath.substring(folderPath.lastIndexOf('/') + 1);
        const metadata = metadataBySha[metadataFile.sha];

        if (!metadata) return null; // Skip if metadata wasn't fetched
        
        const resourceFiles = allFilesByFolder[folderPath] || [];

        const files: z.infer<typeof FileSchema>[] = resourceFiles.map(file => ({
            name: file.path?.substring(folderPath.length + 1) || '',
            size: `${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`,
            downloadUrl: `https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`
        }));

        const resourceDate = metadata.date || new Date().toISOString();

        return {
          title: metadata.title || folderName.replace(/[-_]/g, ' '),
          description: metadata.description || 'No description available.',
          tags: metadata.tags || [input.category],
          subject: metadata.subject,
          semester: metadata.semester,
          year: metadata.year,
          keywords: metadata.keywords || [],
          date: resourceDate,
          downloads: 0, // Placeholder
          folderName: folderName,
          downloadUrl: metadata.downloadUrl,
          files: files,
        };
      }).filter((r): r is ListResourcesOutput[0] => r !== null);


      // 7. Merge resources with the same title
      const mergedResources: Record<string, ListResourcesOutput[0]> = {};

      for (const resource of rawResources) {
          const key = resource.title.trim().toLowerCase();
          if (mergedResources[key]) {
              // Merge files, ensuring no duplicates
              const existingFiles = new Set(mergedResources[key].files.map(f => f.name));
              for (const newFile of resource.files) {
                  if (!existingFiles.has(newFile.name)) {
                      mergedResources[key].files.push(newFile);
                  }
              }
              // Merge tags, ensuring no duplicates
              const existingTags = new Set(mergedResources[key].tags);
               for (const newTag of resource.tags) {
                  if (!existingTags.has(newTag)) {
                      mergedResources[key].tags.push(newTag);
                  }
              }
          } else {
              mergedResources[key] = resource;
          }
      }

      const finalResources = Object.values(mergedResources);

      // 8. Sort by date descending
      finalResources.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return finalResources;

    } catch (error: any) {
       if (error.status === 404) {
        console.warn(`Category "${input.category}" not found or repository is empty. This can happen with an invalid GITHUB_TOKEN. Returning empty array.`);
        return []; 
      }
      console.error('Failed to list resources from GitHub. This is likely due to an invalid or missing GITHUB_TOKEN on the server.', error);
      throw new Error('Failed to list resources from GitHub.');
    }
  }
);
