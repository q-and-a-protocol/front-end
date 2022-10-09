import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const LensApolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.lens.dev',
});

export const GET_DEFAULT_PROFILE = gql`
  query DefaultProfile($address: EthereumAddress!) {
    defaultProfile(request: { ethereumAddress: $address }) {
      id
      name
      bio
      metadata
      handle
      ownedBy
    }
  }
`;
