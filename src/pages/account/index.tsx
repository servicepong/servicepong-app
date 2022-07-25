import { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { addApolloState, initializeApollo } from 'apollo/client';
import {
  MeDocument,
  useConfirmEmailChangeMutation,
} from 'apollo/generated/types';
import { Settings } from 'components/account';

import { Base } from '@uikit/layouts';

interface AccountPageProps {
  token: string | null;
}

const AccountPage: NextPage<AccountPageProps> = ({ token }) => {
  const [confirmEmailChangeMutation] = useConfirmEmailChangeMutation();

  useEffect(() => {
    confirmEmailChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const confirmEmailChange = () => {
    if (token) {
      console.log('here i bims mr. token');
      confirmEmailChangeMutation({
        variables: { token },
        onError: (error) => console.error(error),
        onCompleted: (data) => console.log(data),
      });
    }
  };

  return (
    <>
      <NextSeo title="Account settings" />
      <Base>
        <Settings />
      </Base>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const apolloClient = initializeApollo(req.cookies.token);

  const me = await apolloClient.query({ query: MeDocument });

  return addApolloState(apolloClient, {
    props: {
      me,
      token: query.token || null,
    },
  });
};

export default AccountPage;
