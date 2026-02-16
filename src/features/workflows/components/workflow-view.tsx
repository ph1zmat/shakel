'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useSuspenseWorkflow } from '../hooks/use-workflows';

export const WorkflowView = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" asChild>
					<Link href="/workflows">
						<ArrowLeftIcon className="size-4 mr-2" />
						Назад
					</Link>
				</Button>
			</div>

			<Card className="shadow-none">
				<CardHeader>
					<CardTitle>{workflow.name}</CardTitle>
					<CardDescription>
						{workflow.nodes.length} узлов · {workflow.edges.length} связей
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Редактор workflow будет доступен в ближайшем обновлении.
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
