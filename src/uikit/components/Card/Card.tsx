import { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export const Card: FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      backgroundColor="blackAlpha.300"
      p={4}
      borderRadius="lg"
      borderWidth={1}
      {...props}
    >
      {children}
    </Box>
  );
};
