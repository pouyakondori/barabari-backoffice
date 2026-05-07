import { gql } from '@apollo/client';

export const ADMIN_USERS = gql`
  query AdminUsers($search: String, $role: String, $status: String, $limit: Int, $offset: Int) {
    adminUsers(search: $search, role: $role, status: $status, limit: $limit, offset: $offset) {
      items {
        id
        email
        displayName
        role
        isVerified
        isBanned
        createdAt
      }
      total
      limit
      offset
    }
  }
`;

export const ADMIN_USER = gql`
  query AdminUser($id: ID!) {
    adminUser(id: $id) {
      id
      email
      displayName
      role
      isVerified
      isBanned
      createdAt
    }
  }
`;
