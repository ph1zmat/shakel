import { Header } from '@/features/landing';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Header>{children}</Header>;
}
