import { FC } from 'react';
import ReactTimeAgo from 'react-time-ago';
import Link from 'next/link';
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { PongsQuery, useUpdatePongNameMutation } from 'apollo/generated/types';

import { formatFromSeconds } from '@helper/format';
import { route } from '@helper/routes';
import { CopyToClipboard } from '@uikit/components';

interface PongsTableProps {
  projectId: string;
  data: PongsQuery;
}

const PongsTable: FC<PongsTableProps> = ({ projectId, data }) => {
  // apollo
  const [updatePongNameMutation] = useUpdatePongNameMutation();

  const changeName = (pong: string, name: string) => {
    if (name) {
      updatePongNameMutation({
        variables: {
          uuid: pong,
          project: projectId,
          name,
        },
        onError: (error) => {
          // @TODO error handling
          console.error(error);
        },
        onCompleted: (data) => {
          console.log('changed', data);
        },
      });
    }
  };

  return (
    <Box w={'100%'} overflowX={'auto'}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th w={1}></Th>
            <Th>Name</Th>
            <Th>Ping URL</Th>
            <Th>
              <Text>Period</Text>
              <Text>Grace</Text>
            </Th>
            <Th>
              <Text>Last ping</Text>
              <Text>Duration</Text>
            </Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody>
          {data?.pongs?.edges.map((pong) => (
            <Tr key={pong?.node?.uuid}>
              <Td>
                <HStack>
                  <Box
                    h={2}
                    w={2}
                    backgroundColor={
                      pong?.node?.lastStatus !== null
                        ? pong?.node?.lastStatus
                          ? 'green.300'
                          : 'red.300'
                        : 'gray.300'
                    }
                    borderRadius="full"
                  />
                  <span>#{pong?.node?.pongId}</span>
                </HStack>
              </Td>
              <Td>
                <Editable defaultValue={pong?.node?.name}>
                  <EditablePreview fontWeight="bold" />
                  <EditableInput
                    onBlur={(e) =>
                      changeName(pong?.node?.uuid, e.currentTarget.value)
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      changeName(pong?.node?.uuid, e.currentTarget.value)
                    }
                  />
                </Editable>
              </Td>
              <Td>
                {pong?.node?.pingUrl ? (
                  <HStack>
                    <Text color="gray.500">
                      {new URL(pong.node.pingUrl).hostname}
                      <Text as="span" color="white">
                        {new URL(pong.node.pingUrl).pathname}
                      </Text>
                    </Text>
                    <CopyToClipboard text={pong.node.pingUrl} />
                  </HStack>
                ) : (
                  'Not set'
                )}
              </Td>
              <Td>
                {pong?.node?.period && (
                  <Text color="gray.500">
                    {formatFromSeconds(parseInt(pong?.node?.period), true)}
                  </Text>
                )}
                {pong?.node?.gracePeriod && (
                  <Text color="gray.500">
                    {formatFromSeconds(parseInt(pong?.node?.gracePeriod), true)}
                  </Text>
                )}
              </Td>
              <Td>
                {pong?.node?.lastPing ? (
                  <ReactTimeAgo
                    date={new Date(pong?.node?.lastPing)}
                    locale="en-US"
                  />
                ) : (
                  'N/A'
                )}
                {pong?.node?.duration && (
                  <Text color="gray.500">{pong?.node?.duration}</Text>
                )}
              </Td>
              <Td isNumeric>
                <Link
                  href={route.projectPongDetails(projectId, pong?.node?.uuid)}
                  passHref
                >
                  <Button as="a">Details</Button>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>

        <Tfoot>
          <Tr>
            <Th w={1}></Th>
            <Th>Name</Th>
            <Th>Ping URL</Th>
            <Th>
              <Text>Period</Text>
              <Text>Grace</Text>
            </Th>
            <Th>
              <Text>Last ping</Text>
              <Text>Duration</Text>
            </Th>
            <Th></Th>
          </Tr>
        </Tfoot>
      </Table>
    </Box>
  );
};

export { PongsTable };
