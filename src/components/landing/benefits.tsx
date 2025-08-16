import { CheckCircle, Download, Users, Zap } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: <Zap className="h-10 w-10 text-accent" />,
      title: 'Curated Content',
      description: 'All resources are carefully selected and reviewed by experts to ensure quality and relevance.',
    },
    {
      icon: <Download className="h-10 w-10 text-accent" />,
      title: 'Easy to Access',
      description: 'A clean and intuitive interface makes finding and downloading resources a breeze.',
    },
    {
      icon: <Users className="h-10 w-10 text-accent" />,
      title: 'Community Driven',
      description: 'Contribute your own resources and help the community grow. We believe in learning together.',
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-accent" />,
      title: 'Always Free',
      description: 'Access to all our resources is completely free, forever. No hidden costs or subscriptions.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-muted/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Codsach?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the advantages that make us the preferred choice for students and developers.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-md">
                {benefit.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
