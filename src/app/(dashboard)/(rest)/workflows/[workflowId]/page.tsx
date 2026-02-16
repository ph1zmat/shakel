import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { WorkflowView } from '@/features/workflows/components/workflow-view';

interface WorkflowPageProps {
	params: Promise<{ workflowId: string }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
	const { workflowId } = await params;

	return (
		<ErrorBoundary fallback={<div>Ошибка загрузки workflow</div>}>
			<Suspense fallback={<div>Загрузка...</div>}>
				<WorkflowView workflowId={workflowId} />
			</Suspense>
		</ErrorBoundary>
	);
}
