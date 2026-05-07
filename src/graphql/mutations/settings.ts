import { gql } from '@apollo/client';

export const ADMIN_UPDATE_SETTINGS = gql`
  mutation AdminUpdateSettings($input: UpdateSettingsInput!) {
    adminUpdateSettings(input: $input) {
      platformName
      platformDescription
      maintenanceMode
    }
  }
`;

export const ADMIN_SET_FEATURED_COUNTRIES = gql`
  mutation AdminSetFeaturedCountries($countryIds: [ID!]!) {
    adminSetFeaturedCountries(countryIds: $countryIds) {
      id
      name { fa en }
    }
  }
`;

export const ADMIN_SET_FEATURED_TOPICS = gql`
  mutation AdminSetFeaturedTopics($topicIds: [ID!]!) {
    adminSetFeaturedTopics(topicIds: $topicIds) {
      id
      name { fa en }
    }
  }
`;
