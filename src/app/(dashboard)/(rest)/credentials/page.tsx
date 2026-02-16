import { Suspense } from 'react';
import {
	CredentialsList,
	CredentialsContainer,
	CredentialsPagination,
	CredentialsLoading,
	CredentialsError,
} from '@/features/credentials/components/credentials';
import { ErrorBoundary } from 'react-error-boundary';

export default function CredentialsPage() {
	return (
		<CredentialsContainer>
			<ErrorBoundary fallback={<CredentialsError />}>
				<Suspense fallback={<CredentialsLoading />}>
					<CredentialsList />
					<CredentialsPagination />
				</Suspense>
			</ErrorBoundary>
		</CredentialsContainer>
	);
}
