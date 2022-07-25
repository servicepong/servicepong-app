import { SyntheticEvent, useState } from 'react';
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
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AccountError } from 'apollo/generated/types';

import { route } from '@helper/routes';
import { useAuth } from '@hooks/useAuth';
import { Card, Section } from '@uikit/components';
import { Base } from '@uikit/layouts';

interface RegisterProps {
  product?: number;
}

const RegisterPage: NextPage<RegisterProps> = ({ product }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<AccountError[] | ApolloError[]>();
  const [success, setSuccess] = useState<boolean>(false);

  const doRegistration = (e: SyntheticEvent) => {
    e.preventDefault();
    signUp(email, product)
      .then((data) => {
        setSuccess(data.accountRegister?.success || false);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <>
      <NextSeo title="Register" />
      <Base>
        <Section containerWidth="container.sm">
          <Card p={{ base: 8, md: 12 }}>
            <VStack alignItems="flex-start" mb={8}>
              <Heading>Registration</Heading>
              <Text fontSize="xl">We will send you a magic link.</Text>
            </VStack>
            {error && (
              <VStack mb={8}>
                {error?.map((e, index) => (
                  <Alert status="error" rounded="xl" key={`error-msg-${index}`}>
                    <AlertIcon />
                    <AlertTitle mr={1}>Error!</AlertTitle>
                    <AlertDescription>{e.message}</AlertDescription>
                  </Alert>
                ))}
              </VStack>
            )}

            {success ? (
              <Alert status="success" rounded="xl">
                <AlertIcon />
                <AlertTitle mr={1}>Registration complete!</AlertTitle>
                <AlertDescription>
                  Please check your inbox to continue
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={(e) => doRegistration(e)}>
                <VStack gap={4}>
                  <FormControl>
                    <FormLabel htmlFor="email">Email address</FormLabel>
                    <Input
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      size="lg"
                      id="email"
                      type="email"
                    />
                  </FormControl>
                  <Box w="100%">
                    <ButtonGroup>
                      <Button type="submit" size="lg" colorScheme="green">
                        Submit
                      </Button>
                      <Link href={route.login()} passHref>
                        <Button as="a" size="lg" variant="ghost">
                          Already registerd?
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
      product: query.product || '',
    },
  };
};

export default RegisterPage;
