import { FC } from 'react';
import { useRouter } from 'next/router';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
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

  const createPong = (
    type: 'SSL' | 'HTTP' | 'Icmp' | 'Heartbeat' = 'Heartbeat'
  ) => {
    createPongMutation({
      variables: {
        project: projectId,
        variant: type,
      },
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
              <Menu>
                <MenuButton
                  colorScheme="green"
                  size="lg"
                  as={Button}
                  leftIcon={<AddIcon />}
                  rightIcon={<ChevronDownIcon />}
                >
                  Create pong
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => createPong('Icmp')}>
                    <Box>
                      <strong>Ping</strong>
                      <br />
                      <Text fontSize="xs">
                        Monitor your servers to be informed in case of an outage
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => createPong('HTTP')}>
                    <Box>
                      <strong>HTTP</strong>
                      <br />
                      <Text fontSize="xs">
                        Monitor your website to be informed in case of an outage
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => createPong('SSL')}>
                    <Box>
                      <strong>SSL</strong>
                      <br />
                      <Text fontSize="xs">
                        Monitor your cron jobs eg. to ensure the creation of
                        backups
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => createPong('Heartbeat')}>
                    <Box>
                      <strong>Heartbeat</strong>
                      <br />
                      <Text fontSize="xs">
                        Monitor your cron jobs eg. to ensure the creation of
                        backups
                      </Text>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <PongsTable projectId={projectId} data={data} />
          </>
        ) : (
          <>
            <EmptyMessage
              button={
                <Menu>
                  <MenuButton
                    colorScheme="green"
                    size="lg"
                    as={Button}
                    leftIcon={<AddIcon />}
                    rightIcon={<ChevronDownIcon />}
                  >
                    Create pong
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => createPong('Icmp')}>
                      <Box>
                        <strong>Ping</strong>
                        <br />
                        <Text fontSize="xs">
                          Monitor your servers to be informed in case of an
                          outage
                        </Text>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={() => createPong('HTTP')}>
                      <Box>
                        <strong>HTTP</strong>
                        <br />
                        <Text fontSize="xs">
                          Monitor your website to be informed in case of an
                          outage
                        </Text>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={() => createPong('SSL')}>
                      <Box>
                        <strong>SSL</strong>
                        <br />
                        <Text fontSize="xs">
                          Monitor your cron jobs eg. to ensure the creation of
                          backups
                        </Text>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={() => createPong('Heartbeat')}>
                      <Box>
                        <strong>Heartbeat</strong>
                        <br />
                        <Text fontSize="xs">
                          Monitor your cron jobs eg. to ensure the creation of
                          backups
                        </Text>
                      </Box>
                    </MenuItem>
                  </MenuList>
                </Menu>
              }
            />
          </>
        )}
      </Section>
    </>
  );
};

export { PongsList };
