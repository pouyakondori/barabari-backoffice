import { gql } from '@apollo/client';

export const CREATE_TIMELINE_EVENT = gql`
  mutation CreateTimelineEvent($input: CreateTimelineEventInput!) {
    createTimelineEvent(input: $input) {
      id
      title { fa en }
    }
  }
`;

export const UPDATE_TIMELINE_EVENT = gql`
  mutation UpdateTimelineEvent($id: ID!, $input: UpdateTimelineEventInput!) {
    updateTimelineEvent(id: $id, input: $input) {
      id
      title { fa en }
    }
  }
`;

export const DELETE_TIMELINE_EVENT = gql`
  mutation DeleteTimelineEvent($id: ID!) {
    deleteTimelineEvent(id: $id)
  }
`;
