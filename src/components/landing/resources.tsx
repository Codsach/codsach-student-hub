import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Code2, FileText, ClipboardList } from 'lucide-react';

export function Resources() {
  const resourceCategories = [
    {
      icon: <Code2 className="h-8 w-8 text-primary" />,
      title: 'Lab Programs',
      description: 'Ready-to-use code for various lab experiments and assignments.',
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Study Notes',
      description: 'Concise and well-organized notes to help you grasp complex topics easily.',
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      title: 'Question Papers',
      description: 'Previous years\' question papers to practice and prepare for exams.',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: 'Textbooks',
      description: 'A collection of recommended textbooks and reference materials.',
    },
  ];

  return (
    <section id="resources" className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Our Resources
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We provide a wide range of materials to support your learning journey.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {resourceCategories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                {category.icon}
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
