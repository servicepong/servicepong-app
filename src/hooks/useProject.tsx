import { createContext, FC, ReactNode, useContext } from 'react';
import { ProjectsQueryResult, ProjectType } from 'apollo/generated/types';

interface ProjectContextInterface {
  projects: ProjectsQueryResult | null;
  currentProject: ProjectType;
}

const ProjectContext = createContext<ProjectContextInterface | undefined>(
  undefined
);

interface ProjectProviderInterface {
  children: ReactNode;
  projects: ProjectsQueryResult;
  projectId: string | null;
}

export const ProjectProvider: FC<ProjectProviderInterface> = ({
  children,
  projects,
  projectId,
}) => {
  const context = useProvideProject(projects, projectId);

  return (
    <ProjectContext.Provider value={context}>
      {children}
    </ProjectContext.Provider>
  );
};

const useProvideProject = (
  projects: ProjectsQueryResult | null,
  projectId: string | null
) => {
  const currentProject = projects?.data?.projects?.find(
    (project) => project.uuid === projectId
  ) as ProjectType;

  return {
    currentProject,
    projects,
  };
};

export const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('Must be wrapped in <ProjectProvider></ProjectProvider>');
  }

  return context as ProjectContextInterface;
};
