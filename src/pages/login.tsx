import { SyntheticEvent, useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { ApolloError } from '@apollo/client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  AccountError,
  useCheckoutSessionUrlMutation,
} from 'apollo/generated/types';

import { route } from '@helper/routes';
import { useAuth } from '@hooks/useAuth';
import { Card, Section } from '@uikit/components';
import { Base } from '@uikit/layouts';

interface LoginProps {
  mail: string;
  token: string;
}

const LoginPage: NextPage<LoginProps> = ({ mail, token }) => {
  const { signIn } = useAuth();
  const [checkoutSessionUrlMutation] = useCheckoutSessionUrlMutation();
  const [email, setEmail] = useState<string>(mail);
  const [error, setError] = useState<AccountError[] | ApolloError>();
  const [success, setSuccess] = useState<boolean>(false);

  const doLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    signIn(email)
      .then(() => {
        setSuccess(true);
      })
      .catch((error: AccountError[]) => {
        setError(error);
      });
  };

  useEffect(() => {
    if (mail && token && token !== '') {
      signIn(mail, token)
        .then((response) => {
          if (response.login?.plan && response.login?.plan !== null) {
            checkoutSessionUrlMutation({
              variables: { plan: response.login.plan },
              onError: (error) => console.error(error),
              onCompleted: (data) => {
                if (data.checkoutSession?.url) {
                  window.location.href = data.checkoutSession.url;
                  return true;
                }
              },
            });
          } else {
            window.location.href = route.dashboard();
            return true;
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mail, token]);

  const showLoading = token !== '' && mail !== '' && !error;

  return (
    <>
      <NextSeo title="Login" />
      <Base>
        <Section containerWidth="container.sm">
          <Card p={{ base: 8, md: 12 }}>
            <VStack alignItems="flex-start" mb={8}>
              <Heading>Login</Heading>
              <Text fontSize="xl">We will send you a magic link.</Text>
            </VStack>

            {error && (
              <VStack mb={8}>
                {Array.isArray(error) ? (
                  error?.map((e, index) => (
                    <Alert
                      status="error"
                      rounded="xl"
                      key={`error-msg-${index}`}
                    >
                      <AlertIcon />
                      <AlertTitle mr={1}>Error!</AlertTitle>
                      <AlertDescription>{e.message}</AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <Alert status="error" rounded="xl">
                    <AlertIcon />
                    <AlertTitle mr={1}>Error!</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </VStack>
            )}

            {showLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : success ? (
              <Alert status="success" rounded="xl">
                <AlertIcon />
                <AlertTitle mr={1}>All good!</AlertTitle>
                <AlertDescription>
                  Please check your inbox to continue.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={(e) => doLogin(e)}>
                <VStack gap={4}>
                  <FormControl>
                    <FormLabel htmlFor="email">Email address</FormLabel>
                    <Input
                      size="lg"
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                  </FormControl>
                  <Box w="100%">
                    <ButtonGroup>
                      <Button size="lg" colorScheme="green" onClick={doLogin}>
                        Submit
                      </Button>
                      <Link href={route.register()} passHref>
                        <Button as="a" size="lg" variant="ghost">
                          Need an account?
                        </Button>
                      </Link>
                    </ButtonGroup>
                  </Box>
                </VStack>
              </form>
            )}
          </Card>
        </Section>
      </Base>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      mail: query.email || '',
      token: query.token || '',
    },
  };
};

export default LoginPage;
