import { FC } from 'react';
import {
  Badge,
  Box,
  Button,
  Code,
  Flex,
  Grid,
  GridItem,
  Heading,
  ModalBody,
  ModalFooter,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { PongLogType, usePongQuery } from 'apollo/generated/types';

import { useModal } from '@hooks/useModal';
import { Card, EmptyMessage } from '@uikit/components';

interface TabLogsProps {
  projectId: string;
  pongId: string;
}

const TabLogs: FC<TabLogsProps> = ({ projectId, pongId }) => {
  // hooks
  const { setModalData } = useModal();
  // apollo
  const { data } = usePongQuery({
    variables: { project: projectId, id: pongId },
  });

  return (
    <Card>
      <Box w={'100%'} overflowX={'auto'}>
        {data?.pong?.logs && data.pong.logs.length > 0 ? (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th isNumeric></Th>
                <Th>Date</Th>
                <Th>Info</Th>
                <Th>Remote Ip</Th>
                <Th>Duration</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.pong.logs.map((log) => (
                <Tr key={log?.id}>
                  <Td>
                    <Text fontSize="sm">#{log?.id}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" whiteSpace={'nowrap'}>
                      {new Date(log?.createdDate).toDateString()}
                    </Text>
                  </Td>
                  <Td>
                    <Flex fontSize="sm">{log?.requestMethod}</Flex>
                  </Td>
                  <Td>
                    <Tag>{log?.remoteIp.slice(0, 15)}</Tag>
                  </Td>
                  <Td>3 sec</Td>
                  <Td isNumeric>
                    <Button
                      size="sm"
                      onClick={() =>
                        setModalData({
                          title: `Log Entry #${log?.id}`,
                          content: <ModalContent log={log} />,
                        })
                      }
                    >
                      Details
                    </Button>
                  </Td>
                </Tr>
              ))}
              {/* <Tr>
                <Td colSpan={6} textAlign="center" p={8}>
                  <Button>Load more</Button>
                </Td>
              </Tr> */}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th></Th>
                <Th>Date</Th>
                <Th>Response</Th>
                <Th>Info</Th>
                <Th>Duration</Th>
                <Th isNumeric></Th>
              </Tr>
            </Tfoot>
          </Table>
        ) : (
          <EmptyMessage />
        )}
      </Box>
    </Card>
  );
};

export { TabLogs };

interface ModalContentProps {
  log: PongLogType | null;
}

const ModalContent: FC<ModalContentProps> = ({ log }) => {
  // hooks
  const { setModalData } = useModal();

  if (!log) {
    return null;
  }

  return (
    <>
      <ModalBody>
        <VStack spacing={8} alignItems="flex-start">
          <Grid templateColumns="repeat(2, 1fr)" w="100%" gap="2">
            <GridItem>
              <Box>
                <Heading size="sm">Request method</Heading>
                <Badge colorScheme="yellow">{log.requestMethod}</Badge>
              </Box>
            </GridItem>
            {log.exitStatus && (
              <GridItem>
                <Box>
                  <Heading size="sm">Exit status</Heading>
                  <Badge colorScheme="green">{log.exitStatus}</Badge>
                </Box>
              </GridItem>
            )}
            <GridItem>
              <Box>
                <Heading size="sm">Remote Ip</Heading>
                <Badge>{log.remoteIp}</Badge>
              </Box>
            </GridItem>
            {log.scheme && (
              <GridItem>
                <Box>
                  <Heading size="sm">Scheme</Heading>
                  <Badge colorScheme="pink">{log.scheme}</Badge>
                </Box>
              </GridItem>
            )}
            <GridItem>
              <Box>
                <Heading size="sm">Created at</Heading>
                <Text>{new Date(log.createdDate).toString()}</Text>
              </Box>
            </GridItem>
          </Grid>

          <Box>
            <Heading size="sm" mb="2">
              User agent
            </Heading>
            <Code>{log.userAgent}</Code>
          </Box>
          {log.body && log.body !== '""' && (
            <Box w="100%">
              <Heading size="sm" mb="2">
                Body
              </Heading>
              <Textarea minH="28" readOnly>
                {JSON.parse(log.body).body}
              </Textarea>
            </Box>
          )}
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="gray" mr={3} onClick={() => setModalData(null)}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};
