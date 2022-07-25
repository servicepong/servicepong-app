import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Section } from '@components/*';

import NotFoundIllustration from '@uikit/icons/404.svg';
import { Base } from '@uikit/layouts';

const Custom500: NextPage = () => {
  return (
    <>
      <NextSeo title="Something is wrong" />
      <Base>
        <Section containerWidth="container.sm">
          <Box textAlign="center">
            <NotFoundIllustration />
            <Heading>Something is wrong…</Heading>
            <Text fontSize={'2xl'}>
              Sorry, something went wrong, if the error persists please contact
              our <a href="mailto:help@servicepong.io">support</a>.
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

export default Custom500;
