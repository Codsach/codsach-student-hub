
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Upload, File, X, Info, PlusCircle, ArrowLeft, Search, Eye, Edit, Trash2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const resources = [
    {
      title: 'Data Structures and Algorithms...',
      description: 'Complete implementation of all DSA lab programs including sortin... dsa-lab-programs.zip • 2.5 MB',
      category: 'Lab Programs',
      uploadDate: 'Jan 15, 2024',
      downloads: 245,
    },
    {
      title: 'Database Management Systems...',
      description: 'Comprehensive notes covering DBMS concepts, SQL, normalizatio... dbms-notes.pdf • 5.2 MB',
      category: 'Notes',
      uploadDate: 'Jan 10, 2024',
      downloads: 189,
    },
    {
      title: 'MCA Entrance Previous Year...',
      description: 'Collection of previous year question papers for MCA entrance... mca-entrance-papers.pdf • 8.1 MB',
      category: 'Question Papers',
      uploadDate: 'Jan 8, 2024',
      downloads: 456,
    },
    {
      title: 'Visual Studio Code Setup Guide',
      description: 'Complete setup guide for VS Code with essential extensions for MCA... vscode-setup.pdf • 1.8 MB',
      category: 'Software Tools',
      uploadDate: 'Jan 5, 2024',
      downloads: 123,
    },
  ];

  const categoryColors: { [key: string]: string } = {
    'Lab Programs': 'bg-blue-100 text-blue-800',
    'Notes': 'bg-green-100 text-green-800',
    'Question Papers': 'bg-purple-100 text-purple-800',
    'Software Tools': 'bg-orange-100 text-orange-800',
  };

  const totalDownloads = resources.reduce((sum, resource) => sum + resource.downloads, 0);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    router.push('/login');
  };


  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage and upload resources for Codsach</p>
        </div>
        <div className='flex items-center gap-4'>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
      </div>
      
      <Tabs defaultValue="manage">
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
              <CardDescription>View, edit, and delete uploaded resources.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search resources..." className="pl-10" />
                    </div>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="lab-programs">Lab Programs</SelectItem>
                            <SelectItem value="notes">Notes</SelectItem>
                            <SelectItem value="question-papers">Question Papers</SelectItem>
                            <SelectItem value="software-tools">Software Tools</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Resource</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead>Downloads</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resources.map((resource, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="font-medium">{resource.title}</div>
                                        <div className="text-sm text-muted-foreground">{resource.description}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${categoryColors[resource.category]} border-none`}>{resource.category}</Badge>
                                    </TableCell>
                                    <TableCell>{resource.uploadDate}</TableCell>
                                    <TableCell>{resource.downloads}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                    <div>
                        Total Resources: {resources.length} <br />
                        Showing {resources.length} resources
                    </div>
                    <div>Total Downloads: {totalDownloads.toLocaleString()}</div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
