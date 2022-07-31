import { FC } from 'react';
import { useRouter } from 'next/router';
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading } from '@chakra-ui/react';
import {
  PongsDocument,
  ProjectQuery,
  useCreatePongMutation,
  usePongsQuery,
} from 'apollo/generated/types';

import { route } from '@helper/routes';
import { EmptyMessage, Section, StatusBadge } from '@uikit/components';
import { PongsTable } from './PongsTable';

interface PongsListProps {
  projectId: string;
  project?: ProjectQuery;
}

const PongsList: FC<PongsListProps> = ({ projectId, project }) => {
  // hooks
  const router = useRouter();
  // apollo
  const { data } = usePongsQuery({ variables: { project: projectId } });
  const [createPongMutation] = useCreatePongMutation();

  const createPong = () => {
    createPongMutation({
      variables: { project: projectId },
      refetchQueries: [PongsDocument],
      onError: (error) => {
        // @TODO error handling
        console.error(error);
      },
      onCompleted: (data) => {
        if (data.pong?.uuid) {
          router.push(route.projectPongDetails(projectId, data.pong?.uuid));
        }
      },
    });
  };

  return (
    <>
      <Section>
        <Heading as="h1" size="xl">
          {project?.project?.name}
        </Heading>
        <Flex gap={4}>
          <Heading as="h2" size="lg" fontWeight="normal">
            Pongs
          </Heading>
          <StatusBadge status={project?.project?.pongsStatus} />
        </Flex>
      </Section>

      <Section>
        {data?.pongs?.edges && data.pongs.edges.length > 0 ? (
          <>
            <Flex justifyContent="space-between">
              <Heading as="h2" size="lg" mb={8}>
                {`${project?.project?.pongCount} Pongs`}
              </Heading>
              <Button
                onClick={() => createPong()}
                colorScheme="green"
                leftIcon={<AddIcon />}
              >
                Create pong
              </Button>
            </Flex>

            <PongsTable projectId={projectId} data={data} />
          </>
        ) : (
          <EmptyMessage
            button={
              <Button
                onClick={() => createPong()}
                colorScheme="green"
                size="lg"
                leftIcon={<AddIcon />}
              >
                Create pong
              </Button>
            }
          />
        )}
      </Section>
    </>
  );
};

export { PongsList };
