import { AddIcon } from '@chakra-ui/icons';
import { Flex, GridItem, Heading } from '@chakra-ui/react';

import { useModal } from '@hooks/useModal';
import { Card } from '@uikit/components';

import { AddProjectModal } from '../AddProjectModal';

const AddProjectCard = () => {
  const { setModalData } = useModal();

  return (
    <GridItem colSpan={{ base: 12, md: 6, lg: 3 }} height="100%">
      <Card
        h="100%"
        onClick={() =>
          setModalData({
            title: 'New Project',
            content: <AddProjectModal />,
          })
        }
        _hover={{ cursor: 'pointer' }}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          h="100%"
        >
          <AddIcon h={12} w={12} color="gray.500" mb={5} />
          <Heading as="h3" size="md" mb={3}>
            New project
          </Heading>
        </Flex>
      </Card>
    </GridItem>
  );
};

export { AddProjectCard };
