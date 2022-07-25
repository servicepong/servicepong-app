import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Container, Flex, Link } from '@chakra-ui/react';

export const Footer: FC = () => {
  return (
    <footer>
      <Box borderTopWidth={1} pt={10} pb={10}>
        <Container maxWidth="container.xl">
          <Flex justifyContent="space-between" flexWrap="wrap">
            <div>
              <strong>servicepong</strong> - made with love in Germany 🇩🇪
            </div>
            <div>
              <Flex as="ul" gap={4}>
                <li style={{ listStyle: 'none' }}>
                  <NextLink
                    href={`${process.env.NEXT_PUBLIC_WEB_URL}/imprint`}
                    passHref
                  >
                    <Link>Imprint</Link>
                  </NextLink>
                </li>
                <li style={{ listStyle: 'none' }}>
                  <NextLink
                    href={`${process.env.NEXT_PUBLIC_WEB_URL}/privacy-policy`}
                    passHref
                  >
                    <Link>Privacy Policy</Link>
                  </NextLink>
                </li>
                <li style={{ listStyle: 'none' }}>
                  <NextLink
                    href={`${process.env.NEXT_PUBLIC_WEB_URL}/pricing`}
                    passHref
                  >
                    <Link>Pricing</Link>
                  </NextLink>
                </li>
                <li style={{ listStyle: 'none' }}>
                  <NextLink
                    href={`${process.env.NEXT_PUBLIC_WEB_URL}/about`}
                    passHref
                  >
                    <Link>About</Link>
                  </NextLink>
                </li>
                <li style={{ listStyle: 'none' }}>
                  <NextLink
                    href={`${process.env.NEXT_PUBLIC_WEB_URL}/blog`}
                    passHref
                  >
                    <Link>Blog</Link>
                  </NextLink>
                </li>
              </Flex>
            </div>
          </Flex>
        </Container>
      </Box>
    </footer>
  );
};
