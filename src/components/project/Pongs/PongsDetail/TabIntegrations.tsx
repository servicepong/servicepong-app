import { ChangeEvent, FC } from 'react';
import {
  Box,
  Switch,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  usePongChannelAddMutation,
  usePongChannelRemoveMutation,
  usePongQuery,
  useProjectChannelsQuery,
} from 'apollo/generated/types';

import { Card } from '@uikit/components';

interface TabIntegrationsProps {
  projectId: string;
  pongId: string;
}
const TabIntegrations: FC<TabIntegrationsProps> = ({ projectId, pongId }) => {
  // hooks
  const toast = useToast();
  // apollo
  const { data: pong } = usePongQuery({
    variables: { project: projectId, id: pongId },
  });
  const { data: projectChannels } = useProjectChannelsQuery({
    variables: { project: projectId },
  });
  const [pongChannelAddMutation] = usePongChannelAddMutation();
  const [pongChannelRemoveMutation] = usePongChannelRemoveMutation();

  const pongChangeChannel = (
    event: ChangeEvent<HTMLInputElement>,
    channel: string
  ) => {
    console.log('change', pong?.pong?.uuid, channel, event.target.checked);
    if (event.target.checked) {
      pongChannelAddMutation({
        variables: {
          pong: pong?.pong?.uuid,
          channel,
        },
        onError: (error) => {
          console.error(error);
        },
        onCompleted: (data) => {
          if (data.pongAddChannel?.success) {
            toast({
              title: 'Channel added.',
              description: `Channel was successfully added.`,
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
          }
        },
      });
    } else {
      pongChannelRemoveMutation({
        variables: {
          pong: pong?.pong?.uuid,
          channel,
        },
        onError: (error) => {
          console.error(error);
        },
        onCompleted: (data) => {
          if (data.pongRemoveChannel?.success) {
            toast({
              title: 'Channel removed.',
              description: `Channel was successfully removed.`,
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
    <Card>
      <Box w={'100%'} overflowX={'auto'}>
        <Table>
          <Thead>
            <Tr>
              <Th w={20}></Th>
              <Th>Name</Th>
              <Th>Transport</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pong?.pong?.channels &&
              pong?.pong?.channels.map((channel) => (
                <Tr key={channel?.uuid}>
                  <Td>
                    <Switch
                      colorScheme="green"
                      size="lg"
                      defaultChecked
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        pongChangeChannel(event, channel?.uuid)
                      }
                    />
                  </Td>
                  <Td>{channel?.name}</Td>
                  <Td>{channel?.transport.name}</Td>
                </Tr>
              ))}
            {projectChannels?.channels &&
              projectChannels?.channels.map((channel) => {
                if (
                  pong?.pong?.channels?.find(
                    (chan) => chan?.uuid === channel.uuid
                  )
                ) {
                  return null;
                }
                return (
                  <Tr key={channel?.uuid}>
                    <Td>
                      <Switch
                        colorScheme="green"
                        size="lg"
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          pongChangeChannel(event, channel?.uuid)
                        }
                      />
                    </Td>
                    <Td>{channel?.name}</Td>
                    <Td>{channel?.transport.name}</Td>
                  </Tr>
                );
              })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th></Th>
              <Th>Name</Th>
              <Th>Transport</Th>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Card>
  );
};

export { TabIntegrations };
