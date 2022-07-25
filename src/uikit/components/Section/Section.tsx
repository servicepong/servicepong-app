import { FC, ReactNode } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';

interface SectionProps {
  children: ReactNode;
  title?: string;
  containerWidth?:
    | 'container.xl'
    | 'container.lg'
    | 'container.md'
    | 'container.sm';
}

export const Section: FC<SectionProps> = ({
  children,
  title,
  containerWidth = 'container.xl',
}) => {
  return (
    <Box py={12}>
      <Container maxW={containerWidth}>
        {title && (
          <Heading size="lg" as="h2" mb={8}>
            {title}
          </Heading>
        )}
        {children}
      </Container>
    </Box>
  );
};
