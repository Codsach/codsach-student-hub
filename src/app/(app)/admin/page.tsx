
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Upload, File, X, Info, PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage and upload resources for Codsach</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="upload">
        <TabsList className="mb-6">
          <TabsTrigger value="upload">Upload Resource</TabsTrigger>
          <TabsTrigger value="manage">Manage Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card className='mb-6'>
            <CardHeader>
                <div className='flex items-center gap-4'>
                    <Github className='h-8 w-8 text-primary' />
                    <div>
                        <CardTitle>GitHub Storage Setup</CardTitle>
                        <CardDescription>Connect your GitHub repository to enable file uploads and storage.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div>
                    <Label>Repository: <Link href="https://github.com/Codsach/codsach-resources" className='text-primary hover:underline'>https://github.com/Codsach/codsach-resources</Link></Label>
                </div>
                <div>
                    <Label htmlFor="gh-token">GitHub Personal Access Token</Label>
                    <Input id="gh-token" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" />
                </div>
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 space-y-2'>
                    <p className='font-semibold flex items-center gap-2'><Info className='h-4 w-4'/>How to get a GitHub Token:</p>
                    <ol className='list-decimal list-inside space-y-1'>
                        <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                        <li>Click "Generate new token (classic)"</li>
                        <li>Select scopes: <span className='font-mono bg-yellow-100 px-1 rounded'>repo</span> (Full control of private repositories)</li>
                        <li>Copy the generated token and paste it above</li>
                        <li><Link href="#" className='text-primary hover:underline'>Create Token</Link></li>
                    </ol>
                </div>
                <Button>Connect GitHub</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" placeholder="Enter resource title" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab-programs">Lab Programs</SelectItem>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="question-papers">Question Papers</SelectItem>
                        <SelectItem value="software-tools">Software Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" placeholder="Enter resource description" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., Data Structures" />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Input id="semester" placeholder="e.g., 1, 2, 3" />
                  </div>
                </div>
                 <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                        <Input id="tags" placeholder="Enter tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
                        <Button type="button" variant="outline" onClick={handleAddTag}><PlusCircle className='h-4 w-4 mr-2' />Add Tag</Button>
                    </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <div key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                </div>
                <div>
                  <Label htmlFor="file">File *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, ZIP, or other file types (Max 25MB for GitHub)</p>
                    <Button variant="outline" className="mt-4">Choose File</Button>
                  </div>
                </div>
                <div className="flex justify-end">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                        <Upload className="mr-2 h-4 w-4" /> Upload to GitHub
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Resources</CardTitle>
              <CardDescription>Edit or delete existing resources.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Manage resources section coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
