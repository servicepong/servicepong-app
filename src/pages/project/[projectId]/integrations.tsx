import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { addApolloState, initializeApollo } from 'apollo/client';
import {
  ProjectChannelsDocument,
  ProjectDocument,
  TransportsDocument,
  useProjectQuery,
} from 'apollo/generated/types';
import { Integrations } from 'components/project';

import { Base } from '@uikit/layouts';

interface IntegrationsPageProps {
  projectId: string;
}

const IntegrationsPage: NextPage<IntegrationsPageProps> = ({ projectId }) => {
  // apollo
  const { data: project } = useProjectQuery({ variables: { id: projectId } });

  return (
    <>
      <NextSeo title={`${project?.project?.name} Integrations`} />
      <Base>
        <Integrations projectId={projectId} />
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
  await apolloClient.query({ query: TransportsDocument });
  await apolloClient.query({
    query: ProjectChannelsDocument,
    variables: { project: projectId },
  });

  return addApolloState(apolloClient, {
    props: {
      projectId,
    },
  });
};

export default IntegrationsPage;
