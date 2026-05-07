import { gql } from '@apollo/client';

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      platformName
      platformDescription
      socialLinks {
        twitter
        instagram
        telegram
      }
      maintenanceMode
    }
  }
`;

export const GET_FEATURED_CONTENT = gql`
  query GetFeaturedContent {
    featuredCountries {
      id
      name { fa en }
    }
    featuredTopics {
      id
      name { fa en }
    }
  }
`;
