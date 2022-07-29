import { createContext, FC, ReactNode, useContext, useState } from 'react';
import {
  ProjectsQuery,
  ProjectType,
  useProjectsQuery,
} from 'apollo/generated/types';

interface ProjectContextInterface {
  projects: ProjectsQuery | undefined;
  currentProject: ProjectType;
  search: (value: string) => void;
  refetch: () => void;
}

const ProjectContext = createContext<ProjectContextInterface | undefined>(
  undefined
);

interface ProjectProviderInterface {
  children: ReactNode;
  projectId: string | null;
}

export const ProjectProvider: FC<ProjectProviderInterface> = ({
  children,
  projectId,
}) => {
  const context = useProvideProject(projectId);

  return (
    <ProjectContext.Provider value={context}>
      {children}
    </ProjectContext.Provider>
  );
};

const useProvideProject = (projectId: string | null) => {
  const { refetch, data } = useProjectsQuery();
  const [projectsState, setProjectsState] = useState<ProjectsQuery | undefined>(
    data
  );

  const refetchProjects = async () => {
    const d = await refetch();
    setProjectsState(d.data);
  };

  const currentProject = data?.projects?.find(
    (project) => project.uuid === projectId
  ) as ProjectType;

  const search = (value: string) => {
    const p = data?.projects?.filter(
      (item) => item.name!.toLowerCase().indexOf(value.toLowerCase()) > -1
    );

    setProjectsState((oldstate) => ({ ...oldstate, projects: p }));
  };

  return {
    currentProject,
    projects: projectsState || data,
    search,
    refetch: refetchProjects,
  };
};

export const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('Must be wrapped in <ProjectProvider></ProjectProvider>');
  }

  return context as ProjectContextInterface;
};
