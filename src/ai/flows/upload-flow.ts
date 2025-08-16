'use server';
/**
 * @fileOverview A flow for uploading or updating files in a GitHub repository.
 *
 * - uploadFile - A function that handles the file upload/update process to GitHub.
 * - UploadFileInput - The input type for the uploadFile function.
 * - UploadFileOutput - The return type for the uploadFile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Octokit } from 'octokit';

const UploadFileInputSchema = z.object({
  githubToken: z.string().describe('The GitHub personal access token.'),
  repository: z
    .string()
    .describe('The GitHub repository in the format "owner/repo".'),
  filePath: z
    .string()
    .describe('The path where the file will be stored in the repository.'),
  fileContent: z
    .string()
    .optional()
    .describe('The content of the file, base64 encoded. Optional for metadata-only updates.'),
  commitMessage: z.string().describe('The commit message for the file upload.'),
  metadata: z.object({
    title: z.string(),
    description: z.string(),
    subject: z.string().optional(),
    semester: z.string().optional(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional(),
  }).describe("Metadata associated with the file."),
});
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;

const UploadFileOutputSchema = z.object({
  success: z.boolean().describe('Whether the file upload was successful.'),
  url: z.string().optional().describe('The URL of the uploaded file.'),
  error: z.string().optional().describe('An error message if the upload failed.'),
});
export type UploadFileOutput = z.infer<typeof UploadFileOutputSchema>;


export async function uploadFile(
  input: UploadFileInput
): Promise<UploadFileOutput> {
  return uploadFileFlow(input);
}

// Helper to get file SHA
async function getFileSha(octokit: Octokit, owner: string, repo: string, path: string): Promise<string | undefined> {
    try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
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


const uploadFileFlow = ai.defineFlow(
  {
    name: 'uploadFileFlow',
    inputSchema: UploadFileInputSchema,
    outputSchema: UploadFileOutputSchema,
  },
  async (input) => {
    const octokit = new Octokit({ auth: input.githubToken });
    const [owner, repo] = input.repository.split('/');

    try {
      let fileUrl: string | undefined;

      // 1. Upload/Update the actual file if content is provided
      if (input.fileContent) {
          const fileSha = await getFileSha(octokit, owner, repo, input.filePath);
          const fileResponse = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: input.filePath,
            message: input.commitMessage,
            content: input.fileContent,
            sha: fileSha,
          });
          fileUrl = fileResponse.data.content?.html_url;
      }


      // 2. Upload/Update the metadata file
      const metadataPath = input.filePath.replace(/\.[^/.]+$/, "") + '.json';
      const metadataContent = Buffer.from(JSON.stringify(input.metadata, null, 2)).toString('base64');
      const metadataSha = await getFileSha(octokit, owner, repo, metadataPath);
      
      await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: metadataPath,
          message: `feat: Add/Update metadata for ${input.metadata.title}`,
          content: metadataContent,
          sha: metadataSha,
      });

      return {
        success: true,
        url: fileUrl,
      };
    } catch (error: any) {
      console.error("GitHub Upload Error:", error);
      return {
        success: false,
        error: error.message || 'Failed to upload file to GitHub.',
      };
    }
  }
);
