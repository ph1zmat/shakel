import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ProjectsContainer,
  ProjectList,
  ProjectsPagination,
  ProjectsError,
  ProjectsLoading,
} from '@/features/project/components/projects';

export default function ProjectsPage() {
  return (
    <ProjectsContainer>
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectList />
          <ProjectsPagination />
        </Suspense>
      </ErrorBoundary>
    </ProjectsContainer>
  );
}
