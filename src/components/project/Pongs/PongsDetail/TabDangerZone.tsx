import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  PongsDocument,
  useDeletePongMutation,
  usePongQuery,
  useProjectsQuery,
  useTransferPongMutation,
} from 'apollo/generated/types';

import { route } from '@helper/routes';
import { useConfirmModal } from '@hooks/useConfirmModal';
import { Card } from '@uikit/components';

interface TabDangerZoneProps {
  projectId: string;
  pongId: string;
}

const TabDangerZone: FC<TabDangerZoneProps> = ({ projectId, pongId }) => {
  // hooks
  const router = useRouter();
  const toast = useToast();
  const { setConfirmModalData } = useConfirmModal();
  const [transferProjectId, setTransferProjectId] = useState<string>();
  // apollo
  const { data: pong } = usePongQuery({
    variables: { project: projectId, id: pongId },
  });
  const { data: projects } = useProjectsQuery();
  const [deletePongMutation] = useDeletePongMutation();
  const [transferPongMutation] = useTransferPongMutation();

  const transferPong = () => {
    if (transferProjectId) {
      transferPongMutation({
        variables: {
          pong: pongId,
          project: transferProjectId,
        },
        refetchQueries: [PongsDocument],
        onError: (error) => console.error(error),
        onCompleted: (data) => {
          if (data.pongTransfer?.success) {
            toast({
              title: 'Pong transfered.',
              description: `Pong '${pong?.pong?.name}' was successfully transfered.`,
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            router.push(route.projectPongDetails(transferProjectId, pongId));
          }
        },
      });
    }
  };

  const deletePong = () => {
    deletePongMutation({
      variables: { uuid: pongId },
      refetchQueries: [PongsDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data?.pongDelete?.uuid) {
          toast({
            title: 'Pong deleted.',
            description: `Pong '${pong?.pong?.name}' was successfully deleted.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          router.push(route.projectPongs(projectId));
        }
      },
    });
  };

  return (
    <VStack spacing={8}>
      <Card w="100%">
        <Heading mb={4} as="h2" size="md">
          Transfer to other project
        </Heading>
        <FormControl mb={5}>
          <FormLabel>New project</FormLabel>
          <Select
            onChange={(e) => setTransferProjectId(e.currentTarget.value)}
            placeholder="Select a project"
          >
            {projects?.projects &&
              projects.projects
                .filter((project) => project.uuid !== projectId)
                .map((p) => (
                  <option key={p.projectId} value={p.uuid}>
                    {p.name}
                  </option>
                ))}
          </Select>
        </FormControl>
        <Button
          colorScheme="red"
          onClick={() =>
            setConfirmModalData({
              title: 'Are you sure?',
              text: 'If you confirm, the pong will be moved to the selected project.',
              onConfirm: transferPong,
            })
          }
        >
          Transfer
        </Button>
      </Card>

      <Card w="100%">
        <Heading mb={4} as="h2" size="md">
          Delete pong
        </Heading>
        <Text mb={5}>
          If you delete the pong, all associated settings and log entries will
          also be deleted.
        </Text>
        <Button
          colorScheme="red"
          onClick={() =>
            setConfirmModalData({
              title: 'Are you sure?',
              text: 'If you confirm, the pong and all its data will be irrevocably deleted.',
              onConfirm: deletePong,
            })
          }
        >
          Delete
        </Button>
      </Card>
    </VStack>
  );
};

export { TabDangerZone };
