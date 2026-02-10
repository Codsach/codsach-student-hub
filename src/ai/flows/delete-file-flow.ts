
'use server';
/**
 * @fileOverview A flow for deleting a single file from GitHub.
 *
 * - deleteFile - A function that handles deleting a file from GitHub.
 * - DeleteFileInput - The input type for the deleteFile function.
 * - DeleteFileOutput - The return type for the deleteFile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Octokit } from 'octokit';

const DeleteFileInputSchema = z.object({
  githubToken: z.string().describe('The GitHub personal access token.'),
  repository: z
    .string()
    .describe('The GitHub repository in the format "owner/repo".'),
  filePath: z.string().describe('The path to the file to be deleted.'),
});
export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

const DeleteFileOutputSchema = z.object({
  success: z.boolean().describe('Whether the deletion was successful.'),
  error: z.string().optional().describe('An error message if deletion failed.'),
});
export type DeleteFileOutput = z.infer<typeof DeleteFileOutputSchema>;

export async function deleteFile(
  input: DeleteFileInput
): Promise<DeleteFileOutput> {
  return deleteFileFlow(input);
}

// Helper to get file SHA
async function getFileSha(octokit: Octokit, owner: string, repo: string, path: string, branch: string): Promise<string | undefined> {
    try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });
        if (!Array.isArray(data) && data.sha) {
            return data.sha;
        }
        return undefined;
    } catch (error: any) {
        if (error.status === 404) {
            return undefined; // File doesn't exist
        }
        throw error;
    }
}


const deleteFileFlow = ai.defineFlow(
  {
    name: 'deleteFileFlow',
    inputSchema: DeleteFileInputSchema,
    outputSchema: DeleteFileOutputSchema,
  },
  async (input) => {
    const octokit = new Octokit({ auth: input.githubToken });
    const [owner, repo] = input.repository.split('/');

    try {
      // Dynamically get the default branch
      let branch: string;
      try {
        const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
        branch = repoData.default_branch;
      } catch (e) {
          console.error("Failed to get repository data. The repository may be empty or inaccessible.", e);
          return { success: false, error: "Could not access the repository." };
      }

      const sha = await getFileSha(octokit, owner, repo, input.filePath, branch);
      
      if (!sha) {
          return { success: true, error: "File not found, assuming already deleted." };
      }

      await octokit.rest.repos.deleteFile({
        owner,
        repo,
        path: input.filePath,
        message: `feat: Delete resource file ${input.filePath}`,
        sha: sha,
        branch: branch,
      });

      return { success: true };
    } catch (error: any) {
      console.error('GitHub File Deletion Error:', error);
      return { success: false, error: error.message || 'Failed to delete file from GitHub.' };
    }
  }
);
