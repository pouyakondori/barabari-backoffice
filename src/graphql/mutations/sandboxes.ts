import { gql } from '@apollo/client';

export const ADMIN_DELETE_SANDBOX = gql`
  mutation AdminDeleteSandbox($id: ID!) {
    adminDeleteSandbox(id: $id)
  }
`;
