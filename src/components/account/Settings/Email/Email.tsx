import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  useMeQuery,
  useRequestEmailChangeMutation,
} from 'apollo/generated/types';

import { Card } from '@uikit/components';

const Email = () => {
  // hooks
  const toast = useToast();
  const [newEmail, setNewEmail] = useState<string>();
  // apollo
  const { data: me } = useMeQuery();
  const [requestEmailChangeMutation] = useRequestEmailChangeMutation();

  const requestNewEmail = () => {
    if (newEmail) {
      requestEmailChangeMutation({
        variables: { newEmail },
        onError: (error) => console.error(error),
        onCompleted: (data) => {
          if (data.requestEmailChange?.success) {
            toast({
              title: 'Email updated.',
              description:
                'The email address was successfully updated. We have sent you a link to confirm.',
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
    <Card w="100%">
      <Heading mb={2} as="h3" size="md">
        Update your email
      </Heading>
      <Box mt={4}>
        <form>
          <VStack spacing={5} alignItems="flex-start">
            <FormControl>
              <FormLabel>Current email address</FormLabel>
              <Input
                variant="filled"
                size="lg"
                type="email"
                value={me?.me?.email}
                readOnly={true}
              />
            </FormControl>
            <FormControl>
              <FormLabel>New email address</FormLabel>
              <Input
                variant="filled"
                size="lg"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.currentTarget.value)}
              />
            </FormControl>
            <Button
              size="lg"
              onClick={() => requestNewEmail()}
              disabled={!newEmail}
            >
              Save
            </Button>
          </VStack>
        </form>
      </Box>
    </Card>
  );
};

export { Email };
