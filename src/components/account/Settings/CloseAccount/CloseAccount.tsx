import { useRouter } from 'next/router';
import { Button, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import { useDeleteAccountMutation } from 'apollo/generated/types';

import { route } from '@helper/routes';
import { Card } from '@uikit/components';

const CloseAccount = () => {
  // hooks
  const router = useRouter();
  const toast = useToast();
  // apollo
  const [deleteAccountMutation] = useDeleteAccountMutation();

  const closeAccount = () => {
    deleteAccountMutation({
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.accountDelete?.success) {
          toast({
            title: 'Account deleted.',
            description: 'Your account was successfully deleted.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          router.push(route.login());
        }
      },
    });
  };

  return (
    <Card w="100%">
      <Heading mb={2} as="h3" size="md">
        Close account
      </Heading>
      <VStack alignItems="flex-start" spacing={5}>
        <Text>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae
          alias suscipit molestiae quis autem officiis maiores, sapiente
          excepturi eveniet. Et, reprehenderit soluta. Natus doloremque quod
          laborum iure molestias non possimus.
        </Text>
        <Button size="lg" colorScheme="red" onClick={() => closeAccount()}>
          Close
        </Button>
      </VStack>
    </Card>
  );
};

export { CloseAccount };
