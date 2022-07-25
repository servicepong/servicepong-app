import { FC, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
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
  ProjectQuery,
  ProjectTokensDocument,
  useCreateProjectTokenMutation,
  useDeleteProjectTokenMutation,
  useProjectTokensQuery,
} from 'apollo/generated/types';

import { useConfirmModal } from '@hooks/useConfirmModal';
import { useModal } from '@hooks/useModal';
import { Card, EmptyMessage } from '@uikit/components';

interface ApiTokensProps {
  projectId: string;
  project?: ProjectQuery;
}

const ApiTokens: FC<ApiTokensProps> = ({ projectId, project }) => {
  // hooks
  const toast = useToast();
  const { setModalData } = useModal();
  const { setConfirmModalData } = useConfirmModal();
  // apollo
  const { data } = useProjectTokensQuery({ variables: { project: projectId } });
  const [createProjectTokenMutation] = useCreateProjectTokenMutation();
  const [deleteProjectTokenMutation] = useDeleteProjectTokenMutation();

  if (!project) {
    return null;
  }

  const createApiToken = (
    tokenDescription: string,
    tokenExpirationDate?: string
  ) => {
    if (tokenDescription) {
      createProjectTokenMutation({
        variables: {
          project: projectId,
          description: tokenDescription,
          expires: tokenExpirationDate,
        },
        refetchQueries: [ProjectTokensDocument],
        onError: (error) => console.error(error),
        onCompleted: (data) => {
          if (data.projectToken?.id) {
            toast({
              title: 'Token created.',
              description: 'New token was successfully created.',
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            setModalData(null);
          }
        },
      });
    }
  };

  const deleteApiToken = (token: number) => {
    deleteProjectTokenMutation({
      variables: { project: project.project?.uuid, token },
      refetchQueries: [ProjectTokensDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.projectTokenDelete?.success) {
          toast({
            title: 'Token deleted.',
            description: 'The token was successfully deleted.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      },
    });
  };

  return (
    <Card w={'100%'}>
      <VStack spacing={8} w="100%" alignItems="flex-start">
        <VStack>
          <Flex justifyContent="space-between" w="100%" alignItems="center">
            <Heading as="h3" size="md">
              API
            </Heading>
            <Button
              size="sm"
              leftIcon={<AddIcon />}
              onClick={() =>
                setModalData({
                  title: 'Create a new token',
                  content: (
                    <ModalContent
                      createApiToken={(tokenDescription, tokenExpirationDate) =>
                        createApiToken(tokenDescription, tokenExpirationDate)
                      }
                    />
                  ),
                })
              }
            >
              Create token
            </Button>
          </Flex>
          <Text mb={2}>
            API tokens allow you to easily work with our API. You can create
            multiple tokens for different environments or users. It is
            recommended to give each token an expiration date to ensure the
            security of your project.
          </Text>
        </VStack>
      </VStack>

      {data?.tokens && data.tokens.length > 0 ? (
        <Box w={'100%'} overflowX={'auto'}>
          <Table mt={8} w={'100%'}>
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>Expires</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.tokens.map((token) => (
                <Tr key={token.id}>
                  <Td>
                    {token.description} {token.id}
                  </Td>
                  <Td>
                    {token.expires
                      ? new Date(token.expires).toLocaleString()
                      : '-'}
                  </Td>
                  <Td isNumeric>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setConfirmModalData({
                          title: 'Are you sure?',
                          text: 'If you confirm, the token will be irrevocably deleted.',
                          onConfirm: () => deleteApiToken(token.id),
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <EmptyMessage msg="No api tokens have been created yet." />
      )}
    </Card>
  );
};

export { ApiTokens };

interface ModalContentProps {
  createApiToken: (token: string, expires?: string) => void;
}

const ModalContent: FC<ModalContentProps> = ({ createApiToken }) => {
  const [tokenDescription, setTokenDescription] = useState<string>('');
  const [tokenExpirationDate, setTokenExpirationDate] = useState<string>();

  return (
    <>
      <ModalBody>
        <VStack spacing={8} alignItems="flex-start">
          <Text>Create a token for a environment or user.</Text>
          <FormControl isRequired>
            <FormLabel>Set a description</FormLabel>
            <Input
              value={tokenDescription}
              onChange={(e) => setTokenDescription(e.currentTarget.value)}
              size="lg"
              placeholder="Local dev setup"
              variant="filled"
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Set a expiration date</FormLabel>
            <Input
              value={tokenExpirationDate}
              onChange={(e) => setTokenExpirationDate(e.currentTarget.value)}
              size="lg"
              variant="filled"
              type="datetime-local"
            />
          </FormControl>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="green"
          mr={3}
          onClick={() => createApiToken(tokenDescription, tokenExpirationDate)}
        >
          Create token
        </Button>
      </ModalFooter>
    </>
  );
};
