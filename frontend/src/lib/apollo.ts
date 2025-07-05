import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Remplacez cette URL par l'URL de votre subgraph déployé
const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/YOUR_SUBGRAPH_NAME';

const httpLink = new HttpLink({
  uri: SUBGRAPH_URL
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});
