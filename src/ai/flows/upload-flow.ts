
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

const FileInputSchema = z.object({
  name: z.string(),
  content: z.string().describe('The base64 encoded content of the file.'),
});

const UploadFileInputSchema = z.object({
  githubToken: z.string().describe('The GitHub personal access token.'),
  repository: z
    .string()
    .describe('The GitHub repository in the format "owner/repo".'),
  files: z.array(FileInputSchema).optional().describe('An array of files to upload.'),
  commitMessage: z.string().describe('The commit message for the file upload.'),
  metadata: z.object({
    title: z.string(),
    description: z.string(),
    subject: z.string().optional(),
    semester: z.string().optional(),
    year: z.string().optional(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional(),
    downloadUrl: z.string().optional(),
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
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: 'main' });
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

// Helper to get file content as JSON
async function getFileContent(octokit: Octokit, owner: string, repo: string, path: string): Promise<any | undefined> {
    try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: 'main' });
        if (!Array.isArray(data) && 'content' in data) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            return JSON.parse(content);
        }
        return undefined;
    } catch (error: any) {
        if (error.status === 404) {
            return undefined; // File doesn't exist
        }
        throw error; // Re-throw other errors
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

    // Standardize folder name from title. This is the key to grouping resources.
    const folderName = input.metadata.title.trim().replace(/\s+/g, '-').toLowerCase();
    const category = input.metadata.tags.find(t => ['notes', 'lab-programs', 'question-papers', 'software-tools'].includes(t));

    if (!category) {
        return {
            success: false,
            error: "Could not determine a valid category from metadata tags. A resource must belong to one of: notes, lab-programs, question-papers, or software-tools.",
        };
    }
    
    // The folder path is now deterministic based on category and title.
    const folderPath = `${category}/${folderName}`;

    try {
      // 1. Create or update the metadata file for the resource group.
      // This is done first to ensure the directory exists before uploading other files.
      const metadataPath = `${folderPath}/metadata.json`;
      
      // Fetch existing metadata to preserve the original creation date.
      const existingMetadata = await getFileContent(octokit, owner, repo, metadataPath);

      const finalMetadata = {
          ...input.metadata,
          // If editing, use all new metadata but preserve the original date.
          // If creating new, use a new date.
          date: existingMetadata?.date || new Date().toISOString(),
      };
      
      const metadataContent = Buffer.from(
        JSON.stringify(finalMetadata, null, 2)
      ).toString('base64');
      
      const metadataSha = await getFileSha(octokit, owner, repo, metadataPath);
      
      const metadataResponse = await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: metadataPath,
          message: `feat: Add/Update metadata for ${input.metadata.title}`,
          content: metadataContent,
          sha: metadataSha,
          branch: 'main',
      });

      // 2. Upload/Update the actual files if content is provided
      if (input.files && input.files.length > 0) {
        for (const file of input.files) {
            const filePath = `${folderPath}/${file.name}`;
            const fileSha = await getFileSha(octokit, owner, repo, filePath);
            await octokit.rest.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: filePath,
                message: `${input.commitMessage} - ${file.name}`,
                content: file.content,
                sha: fileSha,
                branch: 'main',
            });
        }
      }

      return {
        success: true,
        url: metadataResponse.data.content?.html_url,
      };
    } catch (error: any) {
      console.error("GitHub Upload Error:", error);
       if (error.status === 404) {
          return {
              success: false,
              error: "Upload failed: A file path was not found. This can happen if the target repository or branch does not exist. Please check your configuration."
          }
      }
      return {
        success: false,
        error: error.message || 'Failed to upload file to GitHub.',
      };
    }
  }
);
