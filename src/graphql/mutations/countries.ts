import { gql } from '@apollo/client';

export const ADMIN_CREATE_COUNTRY = gql`
  mutation AdminCreateCountry($input: CountryInput!) {
    adminCreateCountry(input: $input) {
      id
      name { fa en }
      slug
      flag
      countryCode
      createdAt
    }
  }
`;

export const ADMIN_UPDATE_COUNTRY = gql`
  mutation AdminUpdateCountry($id: ID!, $input: CountryInput!) {
    adminUpdateCountry(id: $id, input: $input) {
      id
      name { fa en }
      slug
      flag
      countryCode
    }
  }
`;

export const ADMIN_DELETE_COUNTRY = gql`
  mutation AdminDeleteCountry($id: ID!) {
    adminDeleteCountry(id: $id)
  }
`;
