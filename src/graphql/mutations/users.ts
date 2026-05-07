import { gql } from '@apollo/client';

export const ADMIN_UPDATE_USER = gql`
  mutation AdminUpdateUser($id: ID!, $input: AdminUpdateUserInput!) {
    adminUpdateUser(id: $id, input: $input) {
      id
      email
      displayName
      role
      isVerified
      isBanned
      updatedAt
    }
  }
`;

export const ADMIN_DELETE_USER = gql`
  mutation AdminDeleteUser($id: ID!) {
    adminDeleteUser(id: $id)
  }
`;

export const ADMIN_BAN_USER = gql`
  mutation AdminBanUser($id: ID!) {
    adminBanUser(id: $id) {
      id
      isBanned
    }
  }
`;

export const ADMIN_UNBAN_USER = gql`
  mutation AdminUnbanUser($id: ID!) {
    adminUnbanUser(id: $id) {
      id
      isBanned
    }
  }
`;
