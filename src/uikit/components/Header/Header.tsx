import { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useLogoutMutation } from 'apollo/generated/types';

import { useProject } from '@hooks/useProject';
import Logo from '@icons/logo.svg';
import LogoMinimal from '@icons/logo-minimal.svg';

import { route } from '../../../helper/routes';

const Header: FC = () => {
  // hooks
  const { push, pathname } = useRouter();
  const toast = useToast();
  const { currentProject } = useProject();
  // apollo
  const [logoutMutation] = useLogoutMutation();

  const pageName = pathname.split('/')[3];
  const pageBaseName = pathname.split('/')[1];

  const handleLogout = () => {
    logoutMutation({
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.logout?.success) {
          toast({
            title: 'Logged out.',
            description: 'You have been logged out successfully. See you soon!',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          push(route.login());
        }
      },
    });
  };

  return (
    <Box py={{ base: 4, md: 8 }} background="blackAlpha.300">
      <Container maxWidth="container.xl">
        <Grid templateColumns="repeat(12, 1fr)" alignItems="center" gap={4}>
          <GridItem
            colSpan={{
              base: currentProject ? 12 : 4,
              md: currentProject ? 3 : 2,
            }}
          >
            <LogoComponent />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: currentProject ? 4 : 5 }}>
            {currentProject && (
              <ButtonGroup>
                <NextLink
                  href={route.projectPongs(currentProject.uuid)}
                  passHref
                >
                  <Button
                    as="a"
                    variant={
                      pageName && pageName === 'pongs' ? 'solid' : 'ghost'
                    }
                  >
                    Pongs
                  </Button>
                </NextLink>
                <NextLink
                  href={route.projectIntegrations(currentProject.uuid)}
                  passHref
                >
                  <Button
                    as="a"
                    variant={
                      pageName && pageName === 'integrations'
                        ? 'solid'
                        : 'ghost'
                    }
                  >
                    Integrations
                  </Button>
                </NextLink>
                <NextLink
                  href={route.projectSettings(currentProject.uuid)}
                  passHref
                >
                  <Button
                    as="a"
                    variant={
                      pageName && pageName === 'settings' ? 'solid' : 'ghost'
                    }
                  >
                    Settings
                  </Button>
                </NextLink>
              </ButtonGroup>
            )}
          </GridItem>

          {pageBaseName !== 'login' && pageBaseName !== 'register' && (
            <GridItem
              colSpan={5}
              justifyContent="flex-end"
              display={{ base: 'none', md: 'flex' }}
            >
              <ButtonGroup>
                <NextLink href="mailto:hello@servicepong.io" passHref>
                  <Button as="a" variant="ghost">
                    Support
                  </Button>
                </NextLink>
                <NextLink href={`${process.env.NEXT_PUBLIC_DOCS_URL}`} passHref>
                  <Button as="a" variant="ghost" target="_blank">
                    Docs
                  </Button>
                </NextLink>
                <Menu>
                  <MenuButton>
                    <Button
                      as="a"
                      variant="ghost"
                      rightIcon={<ChevronDownIcon />}
                    >
                      Account
                    </Button>
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <NextLink href={route.account()} passHref>
                        <a style={{ display: 'block', width: '100%' }}>
                          Settings
                        </a>
                      </NextLink>
                    </MenuItem>
                    <MenuItem>
                      <NextLink href={route.accountBilling()} passHref>
                        <a style={{ display: 'block', width: '100%' }}>
                          Billing
                        </a>
                      </NextLink>
                    </MenuItem>
                    <MenuItem>
                      <Text onClick={handleLogout}>Logout</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
            </GridItem>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

const LogoComponent: FC = () => {
  const { currentProject, projects } = useProject();
  const { push } = useRouter();

  return (
    <>
      {!currentProject && (
        <>
          <Box display={{ base: 'none', lg: 'block' }}>
            <NextLink href="/" passHref>
              <a>
                <Logo />
              </a>
            </NextLink>
          </Box>
          <Box
            display={{ base: 'block', lg: currentProject ? 'block' : 'none' }}
            maxWidth="50px"
            margin={{ base: 0, md: '0 auto' }}
          >
            <NextLink href="/" passHref>
              <a>
                <LogoMinimal width={50} />
              </a>
            </NextLink>
          </Box>
        </>
      )}
      {currentProject && (
        <Flex gap={4} alignItems="center">
          <Box
            display={{ base: 'block', lg: currentProject ? 'block' : 'none' }}
            maxWidth="50px"
            margin="0 auto"
          >
            <NextLink href="/" passHref>
              <a>
                <LogoMinimal width={50} />
              </a>
            </NextLink>
          </Box>
          <Select
            value={currentProject.uuid}
            onChange={(e) => push(route.projectPongs(e.currentTarget.value))}
          >
            {projects?.projects &&
              projects.projects.map((project) => (
                <option key={project.uuid} value={project.uuid}>
                  {project.name}
                </option>
              ))}
          </Select>
        </Flex>
      )}
    </>
  );
};

export { Header };
