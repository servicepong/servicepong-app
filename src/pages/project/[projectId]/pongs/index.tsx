import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { addApolloState, initializeApollo } from 'apollo/client';
import {
  PongsDocument,
  ProjectDocument,
  useProjectQuery,
} from 'apollo/generated/types';
import { PongsList } from 'components/project';

import { Base } from '@uikit/layouts';

interface PongsPageProps {
  projectId: string;
}

const PongsPage: NextPage<PongsPageProps> = ({ projectId }) => {
  // apollo
  const { data } = useProjectQuery({ variables: { id: projectId } });

  return (
    <>
      <NextSeo title={`${data?.project?.name} Pongs`} />
      <Base>
        <PongsList projectId={projectId} project={data} />
      </Base>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const apolloClient = initializeApollo(req.cookies.token);

  const projectId = query.projectId;

  await apolloClient.query({
    query: ProjectDocument,
    variables: { id: projectId },
  });
  await apolloClient.query({
    query: PongsDocument,
    variables: { project: projectId },
  });

  return addApolloState(apolloClient, {
    props: {
      projectId,
    },
  });
};

export default PongsPage;
