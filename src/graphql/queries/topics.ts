import { gql } from '@apollo/client';

export const GET_TOPICS = gql`
  query GetTopics($limit: Int, $offset: Int, $category: String, $search: String) {
    topics(limit: $limit, offset: $offset, category: $category, search: $search) {
      items {
        id
        name { fa en }
        slug
        description { fa en }
        category
        order
        clauseCount
      }
      total
      limit
      offset
    }
  }
`;

export const GET_TOPIC = gql`
  query GetTopic($slug: String!) {
    topic(slug: $slug) {
      id
      name { fa en }
      slug
      description { fa en }
      category
      order
    }
  }
`;
