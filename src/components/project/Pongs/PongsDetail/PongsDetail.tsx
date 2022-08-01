import { FC } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import {
  usePongQuery,
  useUpdatePongNameMutation,
} from 'apollo/generated/types';

import { Section } from '@uikit/components';
import { TabDangerZone } from './TabDangerZone';
import { TabIntegrations } from './TabIntegrations';
import { TabLogs } from './TabLogs';
import { TabOverview } from './TabOverview';
import { TabSchedule } from './TabSchedule';

interface PongsDetailProps {
  projectId: string;
  pongId: string;
}

const PongsDetail: FC<PongsDetailProps> = ({ projectId, pongId }) => {
  // hooks
  const toast = useToast();
  // apollo
  const { data } = usePongQuery({
    variables: { project: projectId, id: pongId },
  });
  const [updatePongNameMutation] = useUpdatePongNameMutation();

  const changeName = (name: string) => {
    if (name && name !== data?.pong?.name) {
      updatePongNameMutation({
        variables: {
          uuid: pongId,
          project: projectId,
          name,
        },
        onError: (error) => console.error(error),
        onCompleted: (data) => {
          if (data.pong?.uuid) {
            toast({
              title: 'Pong renamed.',
              description: `Pong was successfully renamed.`,
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
          }
        },
      });
    }
  };

  return (
    <>
      <Section containerWidth="container.md">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap={4}>
            <EditIcon />
            <Editable
              fontWeight="bold"
              fontSize="3xl"
              defaultValue={data?.pong?.name}
            >
              <EditablePreview />
              <EditableInput
                onBlur={(e) => changeName(e.currentTarget.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && changeName(e.currentTarget.value)
                }
              />
            </Editable>
            <HStack>
              <Badge>{`#${data?.pong?.pongId}`}</Badge>
              <Badge>Ping @TODO</Badge>
            </HStack>
          </Flex>
        </Flex>

        <Tabs mt={10} colorScheme="green">
          <Box w={'100%'} overflowX={'auto'}>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Schedule</Tab>
              <Tab>Logs</Tab>
              <Tab>Integrations</Tab>
              <Tab whiteSpace={'nowrap'}>Danger zone</Tab>
            </TabList>
          </Box>

          <TabPanels>
            <TabPanel>
              <TabOverview projectId={projectId} pongId={pongId} />
            </TabPanel>
            <TabPanel>
              <TabSchedule projectId={projectId} pongId={pongId} />
            </TabPanel>
            <TabPanel>
              <TabLogs projectId={projectId} pongId={pongId} />
            </TabPanel>
            <TabPanel>
              <TabIntegrations projectId={projectId} pongId={pongId} />
            </TabPanel>
            <TabPanel>
              <TabDangerZone projectId={projectId} pongId={pongId} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Section>
    </>
  );
};

export { PongsDetail };
