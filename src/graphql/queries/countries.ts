import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`
  query GetCountries($limit: Int, $offset: Int, $search: String) {
    countries(limit: $limit, offset: $offset, search: $search) {
      items {
        id
        name { fa en }
        slug
        flag
        abstract { fa en }
        population
        coordinates { lat lng }
        countryCode
        authors { name bio image }
        amendments { year description }
        podcastUrl
        videoUrl
        createdAt
      }
      total
      limit
      offset
    }
  }
`;

export const GET_COUNTRY = gql`
  query GetCountry($slug: String!) {
    country(slug: $slug) {
      id
      name { fa en }
      slug
      flag
      abstract { fa en }
      population
      coordinates { lat lng }
      countryCode
      authors { name bio image }
      amendments { year description }
      podcastUrl
      videoUrl
      createdAt
    }
  }
`;
