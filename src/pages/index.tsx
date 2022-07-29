import { useState } from "react";
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Input,
  Table, Tbody, Td,
  Text, Tfoot, Th, Thead, Tr
} from '@chakra-ui/react';
import { addApolloState, initializeApollo } from 'apollo/client';
import { AddProjectCard } from 'components/index';

import { route } from '@helper/routes';
import { useProject } from '@hooks/useProject';
import IconListView from '@icons/list-view.svg';
import IconTileView from '@icons/tile.svg';
import { ProjectCard, Section, StatusBadge } from '@uikit/components';
import { Base } from '@uikit/layouts';
import { useModal } from '@hooks/useModal';
import { AddProjectModal } from "components/index/AddProjectModal";

type View = "Tile" | "List";

const IndexPage: NextPage = () => {
  const { projects, search } = useProject();
  const [view, setView] = useState<View>("List");
  const { setModalData } = useModal();

  return (
    <>
      <NextSeo title="Projects" />
      <Base>
        <Section>
          <Flex justifyContent={"space-between"}>
            <Heading>Projects</Heading>
            <Flex alignItems={"center"} gap={4}>
              <Text>Search</Text>
              <Input onChange={(e) => search(e.currentTarget.value)} placeholder={"Enter a project name"} variant={"filled"} w={"200px"} type={"search"} />
              <Text>View</Text>
              <ButtonGroup isAttached>
                <IconButton onClick={() => setView("Tile")} colorScheme={view === "Tile" ? 'green' : 'gray'}
                  aria-label='Search database' icon={<Icon as={IconTileView} />} />
                <IconButton onClick={() => setView("List")} colorScheme={view === "List" ? 'green' : 'gray'}
                  aria-label='Search database' icon={<Icon as={IconListView} />} />
              </ButtonGroup>
              <Button
              onClick={() =>
                setModalData({
                  title: 'New Project',
                  content: (
                    <AddProjectModal />
                  ),
                })
              }
                leftIcon={<Icon as={AddIcon} />}>New Project</Button>
            </Flex>
          </Flex>
          <div suppressHydrationWarning>
            {view != "List" ? (
              <Box>
                <Grid mt={7} templateColumns="repeat(12, 1fr)" gap={6}>
                  {projects &&
                    projects?.projects?.map((project) => (
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
              </Box>
            ) : (
              <Box>
                <Table mt={7}>
                  <Thead>
                    <Tr>
                      <Th>
                        Status
                      </Th>
                      <Th>
                        Name
                      </Th>
                      <Th>
                        Pongs
                      </Th>
                      <Th>
                        Integrations
                      </Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {projects &&
                      projects.projects?.map((project) => (
                        <Tr key={project.uuid}>
                          <Td>
                            <StatusBadge status={project.pongsStatus} />
                          </Td>
                          <Td>
                            {project.name}
                          </Td>
                          <Td>
                            {project.pongCount}
                          </Td>
                          <Td>
                            {project.channelCount}
                          </Td>
                          <Td isNumeric>
                            <Link href={route.projectPongs(project.uuid)} passHref={true}>
                              <Button as={"a"} size={"sm"}>Details</Button>
                            </Link>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>
                        Status
                      </Th>
                      <Th>
                        Name
                      </Th>
                      <Th>
                        Pongs
                      </Th>
                      <Th>
                        Integrations
                      </Th>
                      <Th></Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </Box>
            )}
          </div>
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
