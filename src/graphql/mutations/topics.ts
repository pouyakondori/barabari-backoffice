import { gql } from '@apollo/client';

export const ADMIN_CREATE_TOPIC = gql`
  mutation AdminCreateTopic($input: CreateTopicInput!) {
    adminCreateTopic(input: $input) {
      id
      name { fa en }
      slug
      description { fa en }
      category
      order
    }
  }
`;

export const ADMIN_UPDATE_TOPIC = gql`
  mutation AdminUpdateTopic($id: ID!, $input: UpdateTopicInput!) {
    adminUpdateTopic(id: $id, input: $input) {
      id
      name { fa en }
      slug
      description { fa en }
      category
      order
    }
  }
`;

export const ADMIN_DELETE_TOPIC = gql`
  mutation AdminDeleteTopic($id: ID!) {
    adminDeleteTopic(id: $id)
  }
`;
