import { FC } from 'react';
import { useRouter } from 'next/router';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  Heading,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ProjectQuery, useDeleteProjectMutation } from 'apollo/generated/types';

import { route } from '@helper/routes';
import { useConfirmModal } from '@hooks/useConfirmModal';
import { Card } from '@uikit/components';

interface DangerZoneProps {
  projectId: string;
  project?: ProjectQuery;
}

const DangerZone: FC<DangerZoneProps> = ({ projectId, project }) => {
  const router = useRouter();
  // hooks
  const toast = useToast();
  const { setConfirmModalData } = useConfirmModal();
  // apollo
  const [deleteProjectMutation] = useDeleteProjectMutation();

  if (!project) {
    return null;
  }

  const deleteProject = () => {
    deleteProjectMutation({
      variables: { uuid: projectId },
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.projectDelete?.uuid) {
          toast({
            title: 'Project deleted.',
            description: `Project '${project.project?.name}' was successfully deleted.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          router.push(route.dashboard());
        }
      },
    });
  };

  return (
    <Card>
      <VStack spacing={8} w="100%" alignItems="flex-start">
        <VStack alignItems="flex-start">
          <Heading as="h3" size="md">
            Danger Zone
          </Heading>
          <Text mb={2}>
            If you delete the project, all associated pongs, log entries,
            members and API tokens will also be deleted.
          </Text>
          <Alert status="warning" rounded="xl">
            <AlertIcon />
            <AlertDescription>The data cannot be recovered.</AlertDescription>
          </Alert>
        </VStack>
        <ButtonGroup>
          <Button
            colorScheme="red"
            onClick={() =>
              setConfirmModalData({
                title: 'Are you sure?',
                text: 'If you confirm, the project and all its data will be irrevocably deleted.',
                onConfirm: deleteProject,
              })
            }
          >
            Delete
          </Button>
        </ButtonGroup>
      </VStack>
    </Card>
  );
};

export { DangerZone };
