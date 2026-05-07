import { gql } from '@apollo/client';

export const PLATFORM_STATS = gql`
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

export const RECENT_COMMENTS = gql`
  query RecentComments($limit: Int) {
    adminComments(limit: $limit, status: "pending") {
      id
      text
      status
      createdAt
      user { id displayName email }
      clauseId
    }
  }
`;

export const RECENT_USERS = gql`
  query RecentUsers($limit: Int) {
    adminUsers(limit: $limit) {
      id
      email
      displayName
      role
      createdAt
    }
  }
`;
