import { gql } from '@apollo/client';

export const ADMIN_PODCASTS = gql`
  query AdminPodcasts($search: String, $countryId: ID, $topicSlug: String, $limit: Int, $offset: Int) {
    adminPodcasts(search: $search, countryId: $countryId, topicSlug: $topicSlug, limit: $limit, offset: $offset) {
      items {
        id
        title { fa en }
        description { fa en }
        audioUrl
        coverImage
        country { id name { fa en } }
        topic { id name { fa en } }
        duration
        publishedAt
      }
      total
      limit
      offset
    }
  }
`;

export const ADMIN_PODCAST = gql`
  query AdminPodcast($id: ID!) {
    adminPodcast(id: $id) {
      id
      title { fa en }
      description { fa en }
      audioUrl
      coverImage
      country { id name { fa en } }
      topic { id name { fa en } }
      duration
      publishedAt
    }
  }
`;
