import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { Grid, GridItem } from '@chakra-ui/react';
import { addApolloState, initializeApollo } from 'apollo/client';
import { AddProjectCard } from 'components/index';

import { route } from '@helper/routes';
import { useProject } from '@hooks/useProject';
import { ProjectCard, Section } from '@uikit/components';
import { Base } from '@uikit/layouts';

const IndexPage: NextPage = () => {
  const { projects } = useProject();

  return (
    <>
      <NextSeo title="Projects" />
      <Base>
        <Section>
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            {projects &&
              projects.data?.projects?.map((project) => (
                <GridItem
                  key={project.uuid}
                  colSpan={{ base: 12, md: 6, lg: 3 }}
                >
                  <Link href={route.projectPongs(project.uuid)} passHref={true}>
                    <a>
                      <ProjectCard
                        title={project.name || ''}
                        countPong={project.pongCount}
                        countIntegration={project.channelCount}
                        status={{ success: project.pongsStatus }}
                      />
                    </a>
                  </Link>
                </GridItem>
              ))}

            <AddProjectCard />
          </Grid>
        </Section>
      </Base>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo(req.cookies.token);

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default IndexPage;
