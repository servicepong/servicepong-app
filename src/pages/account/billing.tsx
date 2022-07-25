import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { addApolloState, initializeApollo } from 'apollo/client';
import {
  CheckoutSessionUrlDocument,
  CustomerDocument,
  InvoicesDocument,
} from 'apollo/generated/types';
import { Billing } from 'components/account';

import { Base } from '@uikit/layouts';

interface BillingPageProps {
  state: 'success' | 'cancel';
}

const BillingPage: NextPage<BillingPageProps> = ({ state }) => {
  return (
    <>
      <NextSeo title="Billing settings" />
      <Base>
        <>
          {state && state === 'success' ? (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Thank you for your order!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Your order was successful and your plan has been activated.
              </AlertDescription>
            </Alert>
          ) : state === 'cancel' ? (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Your order was not successful!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Sorry, your order was not successful. Please try again or
                contact our <a href="mailto:help@servicepong.io">support</a>.
              </AlertDescription>
            </Alert>
          ) : null}
          <Billing />
        </>
      </Base>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const apolloClient = initializeApollo(req.cookies.token);

  const customerData = await apolloClient.query({ query: CustomerDocument });
  await apolloClient.query({ query: InvoicesDocument });

  // check if the user wants to change the plan
  if (query.product && customerData.data.customer.plan.name === 'Hobby') {
    const checkoutUrl = await apolloClient.mutate({
      mutation: CheckoutSessionUrlDocument,
      variables: { plan: query.product },
    });

    if (checkoutUrl.data.checkoutSession) {
      return {
        redirect: {
          permanent: false,
          destination: checkoutUrl.data.checkoutSession.url,
        },
      };
    }
  }

  return addApolloState(apolloClient, {
    props: {
      state: query.state || '',
    },
  });
};

export default BillingPage;
