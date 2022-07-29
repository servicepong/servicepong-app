import { FC } from 'react';
import {
  Divider,
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

import { Card } from '../Card';
import { StatusBadge } from '../StatusBadge';

interface ProjectCardProps {
  title: string;
  countPong?: number;
  countIntegration?: number;
  status: {
    success?: boolean | null;
    timeago?: Date;
  };
}

export const ProjectCard: FC<ProjectCardProps> = ({
  title,
  countPong,
  countIntegration,
  status,
}) => {
  return (
    <Card height="100%">
      <Heading as="h3" size="md" mb={3}>
        {title}
      </Heading>
      <Flex gap={4}>
        <Stat>
          <StatLabel>Pongs</StatLabel>
          <StatNumber>{countPong}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Integrations</StatLabel>
          <StatNumber>{countIntegration}</StatNumber>
        </Stat>
      </Flex>

      <Divider my={3} />

      <StatusBadge status={status.success} timeago={status.timeago} />
    </Card>
  );
};
