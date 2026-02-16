import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
	ExecutionsList,
	ExecutionsContainer,
	ExecutionsPagination,
	ExecutionsLoading,
	ExecutionsError,
} from '@/features/executions/components/executions';

export default function ExecutionsPage() {
	return (
		<ExecutionsContainer>
			<ErrorBoundary fallback={<ExecutionsError />}>
				<Suspense fallback={<ExecutionsLoading />}>
					<ExecutionsList />
					<ExecutionsPagination />
				</Suspense>
			</ErrorBoundary>
		</ExecutionsContainer>
	);
}
