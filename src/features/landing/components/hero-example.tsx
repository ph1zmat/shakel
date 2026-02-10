import { Button } from '@/components/ui/button';
// Импортируйте нужную анимацию:
// import { NeuralNetwork } from '@/components/ui/hero-animations';
// import { FloatingCards } from '@/components/ui/hero-animations';
// import { PulseGlow } from '@/components/ui/hero-animations';
// import { DynamicRays } from '@/components/ui/hero-animations';
import { MorphingShapes } from '@/components/ui/hero-animations';

export const Hero = () => {
  return (
    <section className="grid grid-cols-2 items-center min-h-[calc(100vh-200px)]">
      <div className="mx-auto px-6 text-left w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Простая веб-разработка{' '}
          <span className="text-gradient">для обычных пользователей</span>
        </h1>
        <p className="text-lg mb-8 text-muted-foreground leading-relaxed">
          Превращайте свои идеи в полноценные веб-приложения без единой строчки
          кода. Автоматизируйте рутинные задачи и освободите время для того, что
          действительно важно. Не нужно изучать программирование или нанимать
          дорогих разработчиков — просто соберите решение, которое работает на
          вас.
        </p>
        <div className="flex gap-4">
          <Button variant="gradient" size="lg" className="px-8" asChild>
            <a href="#get-started">Начать сейчас</a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 border-primary/20 hover:bg-primary/5"
            asChild
          >
            <a href="#pricing">Изучить цены</a>
          </Button>
        </div>
      </div>

      {/* Здесь выбираете нужную анимацию */}
      <div className="flex justify-center items-center h-full relative">
        <div className="relative w-full h-[500px]">
          {/* Замените на нужную анимацию: */}
          {/* <NeuralNetwork /> */}
          {/* <FloatingCards /> */}
          {/* <PulseGlow /> */}
          {/* <DynamicRays /> */}
          <MorphingShapes />
        </div>
      </div>
    </section>
  );
};
