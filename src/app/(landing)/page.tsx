import {
  BentoFeatures,
  CodeShowcase,
  CTA,
  Features,
  Hero,
  HowItWorks,
  LogoCloud,
  Showcase,
  Testimonials,
} from '@/features/landing';

export default function HomePage() {
  return (
    <>
      <header className="sr-only">
        <h1>Shakel - Визуальный конструктор приложений без кода</h1>
        <p>
          Платформа для создания веб-приложений, автоматизации workflows и
          интеграции AI
        </p>
      </header>
      <main className="min-h-screen" id="main-content">
        <Hero />
        <LogoCloud />
        <Showcase />
        <BentoFeatures />
        <CodeShowcase />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CTA />
      </main>
    </>
  );
}
