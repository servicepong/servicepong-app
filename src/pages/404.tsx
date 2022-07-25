import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Section } from '@components/*';

import NotFoundIllustration from '@uikit/icons/404.svg';
import { Base } from '@uikit/layouts';

const Custom404: NextPage = () => {
  return (
    <>
      <NextSeo title="You are lost…" />
      <Base>
        <Section containerWidth="container.sm">
          <Box textAlign="center">
            <NotFoundIllustration />
            <Heading>You are lost…</Heading>
            <Text fontSize={'2xl'}>
              Sorry, we are not sure what you are looing for.
            </Text>
            <Button as="a" href="/" mt={5}>
              Go to dashboard
            </Button>
          </Box>
        </Section>
      </Base>
    </>
  );
};

export default Custom404;
