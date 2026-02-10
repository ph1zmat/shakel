import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

export const useSubscription = () => {
	return useQuery({
		queryKey: ['subscription'],
		queryFn: async () => {
			const { data } = await authClient.customer.state()
			return data
		},
	})
}

export const useHasActiveSubscription = () => {
	const { data: customerState, isLoading, ...rest } = useSubscription()

	const hasActiveSubscription =
		customerState?.activeSubscriptions &&
		customerState.activeSubscriptions.length > 0

	const hasActiveGrantedBenefits =
		customerState?.grantedBenefits && customerState.grantedBenefits.length > 0

	const hasActive = hasActiveSubscription || hasActiveGrantedBenefits

	return {
		hasActive,
		subscription: customerState?.activeSubscriptions?.[0],
		granted: customerState?.grantedBenefits?.[0],
		isLoading,
		...rest,
	}
}
