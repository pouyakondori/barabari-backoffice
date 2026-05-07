import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { env } from '@/config/env';

const httpLink = createHttpLink({
  uri: env.graphqlUrl,
});

const authLink = setContext((_operation, prevContext) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...(prevContext.headers as Record<string, string>),
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
});
