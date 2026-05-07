import { gql } from '@apollo/client';

export const ADMIN_SANDBOXES = gql`
  query AdminSandboxes($userId: ID, $search: String, $limit: Int, $offset: Int) {
    adminSandboxes(userId: $userId, search: $search, limit: $limit, offset: $offset) {
      items {
        id
        title
        user {
          id
          displayName
          email
        }
        clauseCount
        clauses {
          id
          number
          text { fa en }
        }
        createdAt
      }
      total
      limit
      offset
    }
  }
`;
