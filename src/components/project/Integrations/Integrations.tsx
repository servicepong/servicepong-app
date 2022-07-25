import { FC, SyntheticEvent } from 'react';
import Image from 'next/image';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  ModalBody,
  ModalFooter,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  ChannelType,
  ProjectChannelsDocument,
  TransportType,
  useCreateChannelMutation,
  useDeleteChannelMutation,
  useProjectChannelsQuery,
  useProjectQuery,
  useTransportsQuery,
  useUpdateChannelMutation,
} from 'apollo/generated/types';

import { useConfirmModal } from '@hooks/useConfirmModal';
import { useModal } from '@hooks/useModal';
import { Card, EmptyMessage, Section } from '@uikit/components';

interface IntegrationsProps {
  projectId: string;
}

const Integrations: FC<IntegrationsProps> = ({ projectId }) => {
  // hooks
  const toast = useToast();
  const { setModalData } = useModal();
  const { setConfirmModalData } = useConfirmModal();
  // apollo
  const { data: project } = useProjectQuery({ variables: { id: projectId } });
  const { data: transports } = useTransportsQuery();
  const { data: channels } = useProjectChannelsQuery({
    variables: { project: projectId },
  });
  const [createChannelMutation] = useCreateChannelMutation();
  const [updateChannelMutation] = useUpdateChannelMutation();
  const [deleteChannelMutation] = useDeleteChannelMutation();

  interface FormDataSettings {
    [x: string]: FormDataEntryValue;
  }

  const createChannel = (
    e: SyntheticEvent,
    transport: TransportType,
    channel?: ChannelType
  ) => {
    e.preventDefault();
    // @ts-ignore
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const settings = { ...data };
    delete settings.channel;
    delete settings.default;
    delete settings.active;
    delete settings.sendStatusUp;
    delete settings.sendStatusDown;

    // Create and Update have different mutations, as they (currently) cannot be merged.
    // Django must check the `uuid`, if it is null/undefined a new object must be created.
    if (channel) {
      runUpdateChannel(data, channel, transport, settings);
    } else {
      runCreateChannel(data, transport, settings);
    }
  };

  const runCreateChannel = (
    data: FormDataSettings,
    transport: TransportType,
    settings: FormDataSettings
  ) => {
    createChannelMutation({
      variables: {
        project: projectId,
        name: data.channel.toString(),
        transport: transport.id,
        settings: JSON.stringify(settings),
        default: data.hasOwnProperty('default'),
        active: data.hasOwnProperty('active'),
        sendStatusUp: data.hasOwnProperty('sendStatusUp'),
        sendStatusDown: data.hasOwnProperty('sendStatusDown'),
      },
      refetchQueries: [ProjectChannelsDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.channel?.uuid) {
          toast({
            title: 'Channel created.',
            description: 'The channel was successfully created.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          setModalData(null);
        }
      },
    });
  };

  const runUpdateChannel = (
    data: FormDataSettings,
    channel: ChannelType,
    transport: TransportType,
    settings: FormDataSettings
  ) => {
    updateChannelMutation({
      variables: {
        uuid: channel?.uuid,
        project: projectId,
        name: data.channel.toString(),
        transport: transport.id,
        settings: JSON.stringify(settings),
        default: data.hasOwnProperty('default'),
        active: data.hasOwnProperty('active'),
        sendStatusUp: data.hasOwnProperty('sendStatusUp'),
        sendStatusDown: data.hasOwnProperty('sendStatusDown'),
      },
      refetchQueries: [ProjectChannelsDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.channel?.uuid) {
          toast({
            title: 'Channel updated.',
            description: `The channel ${channel.name} was successfully updated.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          setModalData(null);
        }
      },
    });
  };

  const deleteChannel = (uuid: string) => {
    deleteChannelMutation({
      variables: { uuid },
      refetchQueries: [ProjectChannelsDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.channelDelete?.uuid) {
          toast({
            title: 'Channel deleted.',
            description: 'The channel was successfully deleted.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      },
    });
  };

  return (
    <>
      <Section containerWidth="container.md">
        <Heading as="h1" size="xl">
          {project?.project?.name}
        </Heading>
        <Heading as="h2" size="lg" fontWeight="normal">
          Integrations
        </Heading>
        <VStack mt={7}>
          <Card w="100%" overflowX={'auto'}>
            <Heading as="h3" size="md">
              Configured Integrations
            </Heading>
            {channels?.channels && channels.channels.length > 0 ? (
              <Table mt={8}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Active</Th>
                    <Th>Default</Th>
                    <Th>Pongs</Th>
                    <Th isNumeric></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {channels.channels.map((channel) => (
                    <Tr key={channel?.uuid}>
                      <Td>
                        <HStack>
                          <Image
                            src={`/integrations/${channel?.transport.module}.svg`}
                            alt={`${channel?.transport.name} Integration`}
                            height={20}
                            width={20}
                          />
                          <Text>{channel?.name}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Text>
                          {channel?.active ? <CheckIcon /> : <CloseIcon />}
                        </Text>
                      </Td>
                      <Td>
                        <Text>
                          {channel?.default ? <CheckIcon /> : <CloseIcon />}
                        </Text>
                      </Td>
                      <Td>
                        <Text>{channel?.assignedPongs}</Text>
                      </Td>
                      <Td isNumeric>
                        <ButtonGroup>
                          <Button
                            size="sm"
                            onClick={() =>
                              setModalData({
                                title: `Update ${channel.name}`,
                                content: (
                                  <ModalContent
                                    transport={channel.transport}
                                    channel={channel}
                                    createChannel={(e, transport, channel) =>
                                      createChannel(e, transport, channel)
                                    }
                                  />
                                ),
                              })
                            }
                          >
                            Configure
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              setConfirmModalData({
                                title: 'Are you sure?',
                                text: 'If you confirm, the channel will be irrevocably deleted.',
                                onConfirm: () => deleteChannel(channel.uuid),
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <EmptyMessage msg="Currently there are no configured integrations." />
            )}
          </Card>
          <Card w="100%">
            <Heading as="h3" size="md">
              Available Integrations
            </Heading>
            <Table mt={8}>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th isNumeric></Th>
                </Tr>
              </Thead>

              <Tbody>
                {transports?.transports &&
                  transports.transports.map((transport) => (
                    <Tr key={transport.id}>
                      <Td>
                        <VStack alignItems="flex-start">
                          <HStack>
                            <Image
                              src={`/integrations/${transport.module}.svg`}
                              alt={`${transport.name} Integration`}
                              height={20}
                              width={20}
                            />
                            <Text>{transport.name}</Text>
                          </HStack>
                          <Text>{transport.description}</Text>
                        </VStack>
                      </Td>
                      <Td isNumeric>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() =>
                            setModalData({
                              title: 'Create a new channel',
                              content: (
                                <ModalContent
                                  transport={transport}
                                  createChannel={(e, transport) =>
                                    createChannel(e, transport)
                                  }
                                />
                              ),
                            })
                          }
                        >
                          Add
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Card>
        </VStack>
      </Section>
    </>
  );
};

export { Integrations };
interface ModalContentProps {
  transport: TransportType;
  channel?: ChannelType;
  createChannel: (
    e: SyntheticEvent,
    transport: TransportType,
    channel?: ChannelType
  ) => void;
}

const ModalContent: FC<ModalContentProps> = ({
  transport,
  channel,
  createChannel,
}) => {
  interface TransportSchema {
    key: string;
    type: string;
    label: string;
    placeholder: string;
  }

  const renderTransportSettingInput = () => {
    const schema: TransportSchema[] | null = transport
      ? JSON.parse(transport.schema)
      : null;

    if (schema === null) {
      return null;
    }

    const channelSetting = channel
      ? JSON.parse(channel?.transportSetting)
      : undefined;

    return schema.map((tt) => (
      <FormControl isRequired key={tt.key}>
        <FormLabel>{tt.label}</FormLabel>
        <Input
          id={tt.key}
          name={tt.key}
          size="lg"
          placeholder={tt.placeholder}
          variant="filled"
          type={tt.type}
          defaultValue={channel && channelSetting[tt.key]}
        />
      </FormControl>
    ));
  };

  return (
    <form onSubmit={(e) => createChannel(e, transport, channel)}>
      <ModalBody>
        <VStack spacing={8} alignItems="flex-start">
          {!channel ? (
            <Text>Add a new integration to this project.</Text>
          ) : (
            <Text>{`Edit ${channel.name}.`}</Text>
          )}
          <FormControl isRequired>
            <FormLabel>Name for integration</FormLabel>
            <Input
              id="channel"
              name="channel"
              size="lg"
              placeholder="Private email"
              variant="filled"
              type="text"
              defaultValue={channel?.name || ''}
            />
          </FormControl>

          {renderTransportSettingInput()}

          <Accordion allowToggle width="100%">
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box width="100%" textAlign="left">
                    Extended
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <FormControl>
                  <Checkbox
                    id="default"
                    name="default"
                    size="lg"
                    defaultChecked={channel ? channel.default : true}
                  >
                    set channel as default
                  </Checkbox>
                </FormControl>
                <FormControl>
                  <Checkbox
                    id="active"
                    name="active"
                    size="lg"
                    defaultChecked={channel ? channel.active : true}
                  >
                    set channel as active
                  </Checkbox>
                </FormControl>
                <FormControl>
                  <Checkbox
                    id="sendStatusUp"
                    name="sendStatusUp"
                    size="lg"
                    defaultChecked={channel ? channel.sendStatusUp : true}
                  >
                    set channel as sendStatusUp
                  </Checkbox>
                </FormControl>
                <FormControl>
                  <Checkbox
                    id="sendStatusDown"
                    name="sendStatusDown"
                    size="lg"
                    defaultChecked={channel ? channel.sendStatusDown : true}
                  >
                    set channel as sendStatusDown
                  </Checkbox>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="green" mr={3} type="submit">
          {!channel ? 'Create channel' : 'Update channel'}
        </Button>
      </ModalFooter>
    </form>
  );
};
