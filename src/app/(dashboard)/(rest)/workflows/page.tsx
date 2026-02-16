import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
	WorkflowList,
	WorkflowContainer,
	WorkflowsPagination,
	WorkflowsLoading,
	WorkflowsError,
} from '@/features/workflows/components/workflows';

export default function WorkflowsPage() {
	return (
		<WorkflowContainer>
			<ErrorBoundary fallback={<WorkflowsError />}>
				<Suspense fallback={<WorkflowsLoading />}>
					<WorkflowList />
					<WorkflowsPagination />
				</Suspense>
			</ErrorBoundary>
		</WorkflowContainer>
	);
}
