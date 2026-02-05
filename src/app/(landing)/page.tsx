import { Hero } from '@/features/landing';
import BackgroundPaths from '@/shared/components/ui/kokonut/background-paths';

export default function HomePage() {
  return (
    <BackgroundPaths colors={['#3b82f6', '#2dd4bf', '#72e3ad']}>
      <Hero />
    </BackgroundPaths>
  );
}
