import { FC, ReactNode } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

import SearchIllustration from '@icons/search.svg';

interface EmptyMessageProps {
  msg?: string;
  button?: ReactNode;
}

const EmptyMessage: FC<EmptyMessageProps> = ({ msg, button }) => {
  return (
    <>
      <Box margin="0 auto" maxW="300px">
        <SearchIllustration />
      </Box>
      <VStack spacing={2}>
        <Heading>Oops!</Heading>
        <Text fontSize="2xl" mb={4}>
          {msg || 'Sorry! There are currently no data'}
        </Text>
        {button}
      </VStack>
    </>
  );
};

export { EmptyMessage };
