import { FC } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { Badge, Flex, Text } from '@chakra-ui/react';

interface StatusBadgeProps {
  status?: boolean | null;
  timeago?: Date;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, timeago }) => {
  return status !== null ? (
    <Flex alignItems="center" gap={2}>
      {status ? (
        <Badge colorScheme="green">All good</Badge>
      ) : (
        <Badge colorScheme="red">Error(s)</Badge>
      )}
      {timeago && (
        <Text fontSize="sm" color="gray.500">
          <ReactTimeAgo date={timeago} locale="en-US" />
        </Text>
      )}
    </Flex>
  ) : (
    <Flex alignItems="center" gap={2}>
      <Badge colorScheme="gray">Unknown</Badge>
    </Flex>
  );
};
