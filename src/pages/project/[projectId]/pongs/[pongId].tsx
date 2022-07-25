import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { addApolloState, initializeApollo } from 'apollo/client';
import {
  PongDocument,
  PongQueryResult,
  ProjectChannelsDocument,
  ProjectDocument,
  usePongQuery,
} from 'apollo/generated/types';
import { PongsDetail } from 'components/project';

import { Base } from '@uikit/layouts';

interface PongPageProps {
  projectId: string;
  pongId: string;
  pong: PongQueryResult;
}

const PongPage: NextPage<PongPageProps> = ({ projectId, pongId }) => {
  const { data } = usePongQuery({
    variables: { project: projectId, id: pongId },
  });

  return (
    <>
      <NextSeo title={`${data?.pong?.name} Overview`} />
      <Base>
        <PongsDetail projectId={projectId} pongId={pongId} />
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
  const pongId = query.pongId;

  await apolloClient.query({
    query: ProjectDocument,
    variables: { id: projectId },
  });
  await apolloClient.query({
    query: PongDocument,
    variables: { project: projectId, id: pongId },
  });
  await apolloClient.query({
    query: ProjectChannelsDocument,
    variables: { project: projectId },
  });

  return addApolloState(apolloClient, {
    props: {
      pongId,
      projectId,
    },
  });
};

export default PongPage;
