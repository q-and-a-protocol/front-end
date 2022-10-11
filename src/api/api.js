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

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      address
      hasAsked
      hasAnswered
      lastActivityDate
      numberOfQuestionsAsked
      numberOfQuestionsAnswered
    }
  }
`;

export const GET_ALL_QUESTIONS = gql`
  query GetAllNewsfeedEvents {
    newsfeedEvents {
      id
      questioner
      answerer
      questionId
      bounty
      date
      answered
      expiryDate
      expired
    }
  }
`;
