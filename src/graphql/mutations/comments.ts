import { gql } from '@apollo/client';

export const ADMIN_APPROVE_COMMENT = gql`
  mutation AdminApproveComment($id: ID!) {
    adminApproveComment(id: $id) {
      id
      status
    }
  }
`;

export const ADMIN_REJECT_COMMENT = gql`
  mutation AdminRejectComment($id: ID!) {
    adminRejectComment(id: $id) {
      id
      status
    }
  }
`;

export const ADMIN_DELETE_COMMENT = gql`
  mutation AdminDeleteComment($id: ID!) {
    adminDeleteComment(id: $id) {
      id
      status
    }
  }
`;

export const ADMIN_RESTORE_COMMENT = gql`
  mutation AdminRestoreComment($id: ID!) {
    adminRestoreComment(id: $id) {
      id
      status
    }
  }
`;

export const ADMIN_BULK_APPROVE_COMMENTS = gql`
  mutation AdminBulkApproveComments($ids: [ID!]!) {
    adminBulkApproveComments(ids: $ids) {
      count
    }
  }
`;

export const ADMIN_BULK_REJECT_COMMENTS = gql`
  mutation AdminBulkRejectComments($ids: [ID!]!) {
    adminBulkRejectComments(ids: $ids) {
      count
    }
  }
`;

export const ADMIN_BULK_DELETE_COMMENTS = gql`
  mutation AdminBulkDeleteComments($ids: [ID!]!) {
    adminBulkDeleteComments(ids: $ids) {
      count
    }
  }
`;
