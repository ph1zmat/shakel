import { requireAuth } from '@/lib/auth-utils';

export default async function DashboardRestLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await requireAuth();

	return <div className="container mx-auto py-8 px-4">{children}</div>;
}
