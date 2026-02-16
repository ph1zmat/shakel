import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ExecutionView } from '@/features/executions/components/execution';

interface ExecutionPageProps {
	params: Promise<{ executionId: string }>;
}

export default async function ExecutionPage({ params }: ExecutionPageProps) {
	const { executionId } = await params;

	return (
		<ErrorBoundary fallback={<div>Ошибка загрузки execution</div>}>
			<Suspense fallback={<div>Загрузка...</div>}>
				<ExecutionView executionId={executionId} />
			</Suspense>
		</ErrorBoundary>
	);
}
