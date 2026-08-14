import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { CredentialView } from '@/features/credentials/components/credential'

interface CredentialPageProps {
	params: Promise<{ credentialId: string }>
}

export default async function CredentialPage({ params }: CredentialPageProps) {
	const { credentialId } = await params

	return (
		<ErrorBoundary fallback={<div>Ошибка загрузки credential</div>}>
			<Suspense fallback={<div>Загрузка...</div>}>
				<CredentialView credentialId={credentialId} />
			</Suspense>
		</ErrorBoundary>
	)
}
