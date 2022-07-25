import { Heading, VStack } from '@chakra-ui/react';

import { Section } from '@uikit/components';
import { CloseAccount } from './CloseAccount';
import { Email } from './Email';
import { Password } from './Password';
import { TwoFactor } from './TwoFactor';

const Settings = () => {
  return (
    <Section containerWidth="container.md">
      <Heading as="h1" size="xl">
        Account
      </Heading>
      <Heading as="h2" size="lg" fontWeight="normal">
        Settings
      </Heading>

      <VStack mt={8} alignItems="flex-start" spacing={8}>
        <Password />
        <Email />
        <TwoFactor />
        <CloseAccount />
      </VStack>
    </Section>
  );
};

export { Settings };
