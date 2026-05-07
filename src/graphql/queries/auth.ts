import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
      role
      isVerified
      createdAt
    }
  }
`;

export const PLATFORM_STATS_QUERY = gql`
  query PlatformStats {
    platformStats {
      totalUsers
      totalCountries
      totalVotes
      totalComments
      pendingComments
    }
  }
`;
