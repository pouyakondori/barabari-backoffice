import { gql } from '@apollo/client';

export const GET_CONSTITUTION = gql`
  query GetConstitution($countrySlug: String!) {
    constitution(countrySlug: $countrySlug) {
      id
      country {
        id
        name { fa en }
        slug
      }
      pdfUrl
      chapters {
        id
        number
        title { fa en }
        order
        articles {
          id
          number
          title { fa en }
          order
          clauses {
            id
            number
            text { fa en }
            order
            topics { id name { fa en } slug category }
            voteSummary { agree disagree total }
            commentCount
          }
        }
      }
      createdAt
    }
  }
`;

export const GET_CONSTITUTIONS = gql`
  query GetConstitutions {
    constitutions {
      id
      country {
        id
        name { fa en }
        slug
      }
      pdfUrl
      chapters {
        id
        articles {
          id
          clauses { id }
        }
      }
      createdAt
    }
  }
`;

export const GET_CLAUSE = gql`
  query GetClause($id: ID!) {
    clause(id: $id) {
      id
      number
      text { fa en }
      order
      topics { id name { fa en } slug category }
      voteSummary { agree disagree total }
      commentCount
    }
  }
`;
