import { Download, Users, Star, RefreshCw } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: 'Easy Downloads',
      description: 'One-click download for all resources',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community Driven',
      description: 'Content curated by MCA students and faculty',
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: 'Quality Content',
      description: 'Verified and high-quality educational materials',
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-primary" />,
      title: 'Regular Updates',
      description: 'Fresh content added regularly',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Codsach?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built by students, for students. We understand what you need to succeed.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
