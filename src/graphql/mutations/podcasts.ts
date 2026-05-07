import { gql } from '@apollo/client';

export const ADMIN_CREATE_PODCAST = gql`
  mutation AdminCreatePodcast($input: CreatePodcastInput!) {
    adminCreatePodcast(input: $input) {
      id
      title { fa en }
      description { fa en }
      audioUrl
      coverImage
      duration
      publishedAt
    }
  }
`;

export const ADMIN_UPDATE_PODCAST = gql`
  mutation AdminUpdatePodcast($id: ID!, $input: UpdatePodcastInput!) {
    adminUpdatePodcast(id: $id, input: $input) {
      id
      title { fa en }
      description { fa en }
      audioUrl
      coverImage
      duration
      publishedAt
    }
  }
`;

export const ADMIN_DELETE_PODCAST = gql`
  mutation AdminDeletePodcast($id: ID!) {
    adminDeletePodcast(id: $id)
  }
`;
