import { useMemo } from 'react';
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let apolloClient: any;

const httplink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql/`,
  credentials: 'include',
});

const errorLink = onError(({ response, graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // @ts-ignore
      switch (err.extensions?.exception.code) {
        case 'TypeError':
          // @ts-ignore
          response.errors = null;
      }
    }
  }
});

function createApolloClient(
  token: string | null
): ApolloClient<NormalizedCacheObject> {
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const apolloLink = from([errorLink, authLink, httplink]);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: apolloLink,
    cache: new InMemoryCache({
      typePolicies: {
        PongType: {
          keyFields: ["uuid"]
        }
      }
    }),
  });
}

export function initializeApollo(
  token: string | null = null,
  initialState = null
) {
  const _apolloClient = apolloClient ?? createApolloClient(token);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps: any
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApollo(token: string | null, pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(token, state), [token, state]);
  return store;
}
