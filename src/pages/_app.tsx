import type { AppProps } from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import PlausibleProvider from 'next-plausible';
import { DefaultSeo } from 'next-seo';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { addApolloState, initializeApollo, useApollo } from 'apollo/client';
import { ProjectsDocument, ProjectsQueryResult } from 'apollo/generated/types';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import NProgress from 'nprogress';

import { AuthProvider } from '@hooks/useAuth';
import { ConfirmModalProvider } from '@hooks/useConfirmModal';
import { ModalProvider } from '@hooks/useModal';
import { ProjectProvider } from '@hooks/useProject';

import 'nprogress/nprogress.css';
import 'styles/base.scss';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

TimeAgo.addLocale(en);

const ServicePongApp = ({
  Component,
  pageProps,
  projects,
  projectId,
}: AppProps & { projects: ProjectsQueryResult; projectId: string }) => {
  const client = useApollo(null, pageProps);

  const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  };

  const theme = extendTheme({ config });

  return (
    <PlausibleProvider
      enabled={
        process.env.NEXT_PUBLIC_APP_ENV === 'production' ||
        process.env.NEXT_PUBLIC_APP_ENV === 'staging'
      }
      domain={
        process.env.NEXT_PUBLIC_APP_ENV === 'production'
          ? 'app.servicepong.io'
          : 'app.servicepong.xyz'
      }
      trackOutboundLinks
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#9ae6b4" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#111010" />
        <meta charSet="UTF-8" />
      </Head>

      <DefaultSeo
        defaultTitle="Servicepong App"
        titleTemplate="%s | Servicepong App"
        openGraph={{
          type: 'website',
          locale: 'en',
          url: process.env.NEXT_PUBLIC_BASE_URL,
          site_name: 'servicepong app',
        }}
      />

      <ApolloProvider client={client}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <ProjectProvider projects={projects} projectId={projectId}>
              <ModalProvider>
                <ConfirmModalProvider>
                  <Component {...pageProps} />
                </ConfirmModalProvider>
              </ModalProvider>
            </ProjectProvider>
          </AuthProvider>
        </ChakraProvider>
      </ApolloProvider>
    </PlausibleProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
ServicePongApp.getInitialProps = async (context: any) => {
  const appProps = await App.getInitialProps(context);
  if (!context.ctx.req?.cookies || !context.ctx.req.cookies?.token) {
    return { ...appProps };
  }

  const apolloClient = initializeApollo(context.ctx.req.cookies.token);

  const projects = await apolloClient.query({
    query: ProjectsDocument,
  });

  return addApolloState(apolloClient, {
    projects,
    projectId: context.ctx.query.projectId,
    ...appProps,
  });
};

export default ServicePongApp;
