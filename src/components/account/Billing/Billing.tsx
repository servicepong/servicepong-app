import { Heading, VStack } from '@chakra-ui/react';

import { Section } from '@uikit/components';
import { Invoices } from './Invoices';
import { Plan } from './Plan';

const Billing = () => {
  return (
    <Section containerWidth="container.md">
      <Heading as="h1" size="xl">
        Account
      </Heading>
      <Heading as="h2" size="lg" fontWeight="normal">
        Billing
      </Heading>

      <VStack mt={8} alignItems="flex-start" spacing={8}>
        <Plan />
        <Invoices />
      </VStack>
    </Section>
  );
};

export { Billing };
