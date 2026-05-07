import { gql } from '@apollo/client';

export const ADMIN_COMMENTS = gql`
  query AdminComments(
    $clauseId: ID,
    $userId: ID,
    $status: String,
    $search: String,
    $limit: Int,
    $offset: Int
  ) {
    adminComments(
      clauseId: $clauseId,
      userId: $userId,
      status: $status,
      search: $search,
      limit: $limit,
      offset: $offset
    ) {
      items {
        id
        text
        user {
          id
          displayName
          email
        }
        clauseId
        clause {
          id
          number
          text { fa en }
        }
        parentId
        status
        createdAt
        updatedAt
      }
      total
      limit
      offset
    }
  }
`;

export const ADMIN_PENDING_COUNT = gql`
  query AdminPendingCommentCount {
    adminPendingCommentCount
  }
`;
