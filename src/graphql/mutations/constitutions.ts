import { gql } from '@apollo/client';

export const ADMIN_CREATE_CONSTITUTION = gql`
  mutation AdminCreateConstitution($countryId: ID!, $input: ConstitutionInput!) {
    adminCreateConstitution(countryId: $countryId, input: $input) {
      id
      country { id name { fa en } slug }
      pdfUrl
      createdAt
    }
  }
`;

export const ADMIN_UPDATE_CONSTITUTION = gql`
  mutation AdminUpdateConstitution($id: ID!, $input: ConstitutionInput!) {
    adminUpdateConstitution(id: $id, input: $input) {
      id
      pdfUrl
    }
  }
`;

export const ADMIN_DELETE_CONSTITUTION = gql`
  mutation AdminDeleteConstitution($id: ID!) {
    adminDeleteConstitution(id: $id)
  }
`;

export const ADMIN_CREATE_CHAPTER = gql`
  mutation AdminCreateChapter($constitutionId: ID!, $input: ChapterInput!) {
    adminCreateChapter(constitutionId: $constitutionId, input: $input) {
      id
      number
      title { fa en }
      order
    }
  }
`;

export const ADMIN_UPDATE_CHAPTER = gql`
  mutation AdminUpdateChapter($id: ID!, $input: ChapterInput!) {
    adminUpdateChapter(id: $id, input: $input) {
      id
      number
      title { fa en }
      order
    }
  }
`;

export const ADMIN_DELETE_CHAPTER = gql`
  mutation AdminDeleteChapter($id: ID!) {
    adminDeleteChapter(id: $id)
  }
`;

export const ADMIN_CREATE_ARTICLE = gql`
  mutation AdminCreateArticle($chapterId: ID!, $input: ArticleInput!) {
    adminCreateArticle(chapterId: $chapterId, input: $input) {
      id
      number
      title { fa en }
      order
    }
  }
`;

export const ADMIN_UPDATE_ARTICLE = gql`
  mutation AdminUpdateArticle($id: ID!, $input: ArticleInput!) {
    adminUpdateArticle(id: $id, input: $input) {
      id
      number
      title { fa en }
      order
    }
  }
`;

export const ADMIN_DELETE_ARTICLE = gql`
  mutation AdminDeleteArticle($id: ID!) {
    adminDeleteArticle(id: $id)
  }
`;

export const ADMIN_CREATE_CLAUSE = gql`
  mutation AdminCreateClause($articleId: ID!, $input: ClauseInput!) {
    adminCreateClause(articleId: $articleId, input: $input) {
      id
      number
      text { fa en }
      order
    }
  }
`;

export const ADMIN_UPDATE_CLAUSE = gql`
  mutation AdminUpdateClause($id: ID!, $input: ClauseInput!) {
    adminUpdateClause(id: $id, input: $input) {
      id
      number
      text { fa en }
      order
    }
  }
`;

export const ADMIN_DELETE_CLAUSE = gql`
  mutation AdminDeleteClause($id: ID!) {
    adminDeleteClause(id: $id)
  }
`;

export const ADMIN_BULK_IMPORT_CONSTITUTION = gql`
  mutation AdminBulkImportConstitution($countryId: ID!, $input: BulkImportConstitutionInput!) {
    adminBulkImportConstitution(countryId: $countryId, input: $input) {
      id
      country { id name { fa en } slug }
      chapters {
        id
        number
        title { fa en }
        articles {
          id
          number
          title { fa en }
          clauses { id number }
        }
      }
    }
  }
`;

export const ADMIN_REORDER_ITEMS = gql`
  mutation AdminReorderItems($type: String!, $items: [ReorderItemInput!]!) {
    adminReorderItems(type: $type, items: $items)
  }
`;
