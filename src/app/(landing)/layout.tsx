import { Footer, Header } from '@/features/landing';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Header>
      {children}
      <Footer />
    </Header>
  );
}
