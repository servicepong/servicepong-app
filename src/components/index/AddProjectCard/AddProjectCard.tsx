import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  ModalBody,
  ModalFooter,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useCreateProjectMutation } from 'apollo/generated/types';

import { route } from '@helper/routes';
import { useModal } from '@hooks/useModal';
import { Card } from '@uikit/components';

const AddProjectCard = () => {
  const router = useRouter();

  const { setModalData } = useModal();
  const toast = useToast();

  const [createPojectMutation] = useCreateProjectMutation();

  const createProject = (projectName: string) => {
    createPojectMutation({
      variables: { name: projectName },
      onError: (error) => {
        // @TODO server error handling
        console.error(error);
      },
      onCompleted: (data) => {
        if (data?.project?.errors && data?.project?.errors?.length > 0) {
          // @Todo handle error on model base
        } else if (data?.project?.uuid) {
          toast({
            title: 'Project created.',
            description: `Project '${projectName}' was successfully created.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          router.push(route.projectPongs(data.project.uuid));
          setModalData(null);
        }
      },
    });
  };

  return (
    <GridItem colSpan={{ base: 12, md: 6, lg: 3 }} height="100%">
      <Card
        h="100%"
        onClick={() =>
          setModalData({
            title: 'New Project',
            content: (
              <ModalContent
                createProject={(projectName) => createProject(projectName)}
              />
            ),
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

interface ModalContentProps {
  createProject: (title: string) => void;
}

const ModalContent: FC<ModalContentProps> = ({ createProject }) => {
  const [projectTitle, setProjectTitle] = useState<string>('');

  return (
    <>
      <ModalBody>
        <VStack spacing={8} alignItems="flex-start">
          <Text>
            Create projects for an overview of your pongs. There is no limit for
            the projects you can create.
          </Text>
          <FormControl>
            <FormLabel>What is the name of the project?</FormLabel>
            <Input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.currentTarget.value)}
              size="lg"
              placeholder="My new fancy project"
              variant="filled"
              type="text"
            />
          </FormControl>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="green"
          mr={3}
          onClick={() => createProject(projectTitle)}
        >
          Create project
        </Button>
      </ModalFooter>
    </>
  );
};

export { AddProjectCard };
