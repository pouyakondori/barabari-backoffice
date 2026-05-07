import { gql } from '@apollo/client';

export const GET_TIMELINE_EVENTS = gql`
  query GetTimelineEvents($countrySlug: String!) {
    timelineEvents(countrySlug: $countrySlug) {
      id
      title { fa en }
      description { fa en }
      date
      order
    }
  }
`;
