import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Heading, VStack } from '@chakra-ui/react';
import { addApolloState, initializeApollo } from 'apollo/client';
import {
  ProjectDocument,
  ProjectMembersDocument,
  ProjectTokensDocument,
  useProjectQuery,
} from 'apollo/generated/types';
import {
  ApiTokens,
  DangerZone,
  Members,
  ProjectData,
} from 'components/project';

import { Section } from '@uikit/components';
import { Base } from '@uikit/layouts';

interface SettingsPageProps {
  projectId: string;
}

const SettingsPage: NextPage<SettingsPageProps> = ({ projectId }) => {
  // apollo
  const { data } = useProjectQuery({ variables: { id: projectId } });

  return (
    <>
      <NextSeo title={`${data?.project?.name} Settings`} />
      <Base>
        <Section containerWidth="container.md">
          <Heading as="h1" size="xl">
            {data?.project?.name}
          </Heading>
          <Heading as="h2" size="lg" fontWeight="normal">
            Settings
          </Heading>

          <VStack spacing={14} alignItems="flex-start" mt={12}>
            <ProjectData projectId={projectId} project={data} />
            <ApiTokens projectId={projectId} project={data} />
            <Members projectId={projectId} project={data} />
            <DangerZone projectId={projectId} project={data} />
          </VStack>
        </Section>
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
    query: ProjectMembersDocument,
    variables: { project: projectId },
  });
  await apolloClient.query({
    query: ProjectTokensDocument,
    variables: { project: projectId },
  });

  return addApolloState(apolloClient, {
    props: {
      projectId,
    },
  });
};

export default SettingsPage;
