import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ResourceCard } from '@/components/resources/resource-card';
import { ListFilter } from 'lucide-react';

export default function SoftwareToolsPage() {
  const resources = [
    {
      title: 'Visual Studio Code',
      description: 'A powerful and popular code editor with support for various languages and extensions.',
      tags: ['Software Tool', 'Editor', 'Development'],
      keywords: ['vscode', 'ide', 'free'],
      date: 'Jan 30, 2024',
      size: '80 MB',
      downloads: 500,
    },
    {
      title: 'XAMPP Server',
      description: 'A free and open-source cross-platform web server solution stack package.',
      tags: ['Software Tool', 'Server', 'Web Dev'],
      keywords: ['apache', 'mysql', 'php'],
      date: 'Jan 25, 2024',
      size: '160 MB',
      downloads: 350,
    },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Software Tools</h1>
        <p className="text-muted-foreground mt-1">Browse all essential software tools</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="editor">Editors</SelectItem>
                <SelectItem value="server">Servers</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-start-4">
             <label htmlFor="sort" className="text-sm font-medium">Sort by</label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Upload Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Upload Date</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">Showing {resources.length} of {resources.length} resources</p>

      <div className="space-y-6">
        {resources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>
    </div>
  );
}
