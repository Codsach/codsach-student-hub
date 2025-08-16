'use client';
import { useEffect, useState, useRef } from 'react';
import { Book, Download, Users, HardDrive } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = (frame / totalFrames);
      const currentCount = Math.round(end * progress);
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, totalFrames]);

  return <span>{count.toLocaleString()}{suffix}+</span>;
};

const StatCard = ({ title, value, unit, duration }: { title: string, value: number, unit: string, duration?: number }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-primary">
        {isInView ? <AnimatedCounter end={value} duration={duration} suffix={unit === 'GB' ? 'GB': (unit === 'K' ? 'K' : '')} /> : `0${unit}+`}
      </div>
      <p className="text-muted-foreground mt-2">{title}</p>
    </div>
  );
};

export function Stats() {
  const stats = [
    {
      title: 'Total Resources',
      value: 500,
      unit: ''
    },
    {
      title: 'Downloads',
      value: 10,
      unit: 'K'
    },
    {
      title: 'Students',
      value: 1000,
      unit: ''
    },
    {
      title: 'Storage',
      value: 25,
      unit: 'GB'
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
