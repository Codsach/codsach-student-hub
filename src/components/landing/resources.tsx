import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, BookOpen, FileText, Settings } from 'lucide-react';

export function Resources() {
  const resourceCategories = [
    {
      icon: <Code2 className="h-8 w-8 text-white" />,
      title: 'Lab Programs',
      description: 'Complete lab programs with source code and explanations',
      count: '150+ Programs',
      color: 'bg-blue-500'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      title: 'Study Notes',
      description: 'Comprehensive notes for all MCA subjects',
      count: '200+ Notes',
      color: 'bg-green-500'
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: 'Question Papers',
      description: 'Previous year question papers and solutions',
      count: '100+ Papers',
      color: 'bg-purple-500'
    },
    {
      icon: <Settings className="h-8 w-8 text-white" />,
      title: 'Software Tools',
      description: 'Essential software and development tools',
      count: '50+ Tools',
      color: 'bg-orange-500'
    },
  ];

  return (
    <section id="resources" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Our Resources
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need for your MCA journey, organized and easily accessible
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {resourceCategories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow duration-300 border rounded-lg">
              <CardHeader className="flex-col items-start gap-4 space-y-0 pb-2">
                <div className={`p-3 rounded-md ${category.color}`}>
                  {category.icon}
                </div>
                <CardTitle className="font-semibold">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <Badge variant="outline">{category.count}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
