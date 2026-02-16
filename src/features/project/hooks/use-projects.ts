'use client';

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { useProjectsParams } from './use-projects-params';

export const useSuspenseProjects = () => {
	const trpc = useTRPC();
	const [params] = useProjectsParams();
	return useSuspenseQuery(trpc.projects.getMany.queryOptions(params));
};

export const useCreateProject = () => {
	const queryClient = useQueryClient();
	const trpc = useTRPC();
	return useMutation(
		trpc.projects.create.mutationOptions({
			onSuccess: (data) => {
				if (data) {
					toast.success(`Проект «${data.name}» создан`);
				}
				queryClient.invalidateQueries(
					trpc.projects.getMany.queryOptions({}),
				);
			},
			onError: (error) => {
				toast.error(`Ошибка создания проекта: ${error.message}`);
			},
		}),
	);
};

export const useRemoveProject = () => {
	const queryClient = useQueryClient();
	const trpc = useTRPC();
	return useMutation(
		trpc.projects.delete.mutationOptions({
			onSuccess: () => {
				toast.success('Проект удалён');
				queryClient.invalidateQueries(
					trpc.projects.getMany.queryOptions({}),
				);
			},
			onError: (error) => {
				toast.error(`Ошибка удаления проекта: ${error.message}`);
			},
		}),
	);
};
