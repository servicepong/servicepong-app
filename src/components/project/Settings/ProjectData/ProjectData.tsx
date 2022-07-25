import { FC, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  ProjectDocument,
  ProjectQuery,
  useUpdateProjectMutation,
} from 'apollo/generated/types';

import { Card } from '@uikit/components';

interface ProjectDataProps {
  projectId: string;
  project?: ProjectQuery;
}

const ProjectData: FC<ProjectDataProps> = ({ projectId, project }) => {
  // hooks
  const toast = useToast();
  const [projectName, setProjectName] = useState<string>(
    project?.project?.name || 'Unnamed'
  );
  // apollo
  const [updateProjectMutation] = useUpdateProjectMutation();

  const updateProjectName = () => {
    if (projectName && projectName !== project?.project?.name) {
      updateProjectMutation({
        variables: { uuid: projectId, name: projectName },
        refetchQueries: [ProjectDocument],
        onError: (error) => console.error(error),
        onCompleted: (data) => {
          if (data.project?.uuid) {
            toast({
              title: 'Project updated.',
              description: `Project '${project?.project?.name}' was successfully updated.`,
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
          }
        },
      });
    } else {
      toast({
        title: 'Project update error.',
        description: `Project '${project?.project?.name}' could not updated. The name is empty or has not been changed.`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Card w="100%">
      <VStack spacing={8} w="100%" alignItems="flex-start">
        <VStack alignItems="flex-start">
          <Heading as="h3" size="md">
            Project name
          </Heading>
          <Text mb={2}>
            The project name helps you sort and easily recognize your projects.
            Also, the project name appears in notifications, so you can quickly
            find related information.
          </Text>
        </VStack>
        <VStack alignItems="flex-start" w="100%" spacing={5}>
          <FormControl>
            <FormLabel>Project title</FormLabel>
            <Input
              value={projectName}
              type="text"
              onChange={(e) => setProjectName(e.currentTarget.value)}
              size="lg"
              variant="filled"
            />
          </FormControl>
          <Button size="lg" onClick={updateProjectName}>
            Save
          </Button>
        </VStack>
      </VStack>
    </Card>
  );
};

export { ProjectData };
