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
import { useChangePasswordMutation } from 'apollo/generated/types';

import { Card } from '@uikit/components';

const Password = () => {
  // hooks
  const toast = useToast();
  const [newPassword, setNewPassword] = useState<string>();
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>();
  // apollo
  const [changePasswordMutation] = useChangePasswordMutation();

  const updatePassword = () => {
    if (newPassword && newConfirmPassword) {
      if (newPassword !== newConfirmPassword) {
        // @TODO passwords not equal
      } else {
        changePasswordMutation({
          variables: { newPassword },
          onError: (error) => console.error(error),
          onCompleted: (data) => {
            if (data.passwordChange?.success) {
              toast({
                title: 'Password updated.',
                description: 'Your password was successfully updated.',
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
            }
          },
        });
      }
    }
  };

  return (
    <Card w="100%">
      <Heading mb={2} as="h3" size="md">
        Update your password
      </Heading>
      <Box mt={4}>
        <form>
          <VStack spacing={5} alignItems="flex-start">
            <FormControl>
              <FormLabel>New password</FormLabel>
              <Input
                variant="filled"
                size="lg"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Repeat your new password</FormLabel>
              <Input
                variant="filled"
                size="lg"
                type="password"
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.currentTarget.value)}
              />
            </FormControl>
            <Button
              size="lg"
              onClick={() => updatePassword()}
              disabled={!(newPassword && newConfirmPassword)}
            >
              Save
            </Button>
          </VStack>
        </form>
      </Box>
    </Card>
  );
};

export { Password };
