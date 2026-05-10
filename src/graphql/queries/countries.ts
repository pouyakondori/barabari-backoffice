import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`
  query GetCountries($limit: Int, $offset: Int, $search: String) {
    countries(limit: $limit, offset: $offset, search: $search) {
      id
      name { fa en }
      slug
      flag
      abstract { fa en }
      population
      coordinates { lat lng zoom }
      countryCode
      totalArea
      landlocked
      borders
      naturalResources
      authors { name { fa en } bio { fa en } imageUrl }
      amendments { year description { fa en } }
      systemOfGovernment
      hdi
      independenceDate
      officialLanguages
      gdp
      economicType
      religiousComposition { religion percentage }
      urbanizationRate
      corruptionIndex
      createdAt
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
      coordinates { lat lng zoom }
      countryCode
      totalArea
      landlocked
      borders
      naturalResources
      authors { name { fa en } bio { fa en } imageUrl }
      amendments { year description { fa en } }
      systemOfGovernment
      hdi
      independenceDate
      officialLanguages
      gdp
      economicType
      religiousComposition { religion percentage }
      urbanizationRate
      corruptionIndex
      createdAt
    }
  }
`;

export const GET_COUNTRY_BY_ID = gql`
  query GetCountryById($id: ID!) {
    countryById(id: $id) {
      id
      name { fa en }
      slug
      flag
      abstract { fa en }
      population
      coordinates { lat lng zoom }
      countryCode
      totalArea
      landlocked
      borders
      naturalResources
      authors { name { fa en } bio { fa en } imageUrl }
      amendments { year description { fa en } }
      systemOfGovernment
      hdi
      independenceDate
      officialLanguages
      gdp
      economicType
      religiousComposition { religion percentage }
      urbanizationRate
      corruptionIndex
      createdAt
    }
  }
`;
