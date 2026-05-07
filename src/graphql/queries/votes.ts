import { gql } from '@apollo/client';

export const ADMIN_VOTE_STATS = gql`
  query AdminVoteStats($groupBy: String, $dateRange: DateRangeInput) {
    adminVoteStats(groupBy: $groupBy, dateRange: $dateRange) {
      totalAgree
      totalDisagree
      totalVotes
      breakdown {
        label
        agree
        disagree
        total
      }
    }
  }
`;

export const ADMIN_CLAUSE_RANKINGS = gql`
  query AdminClauseVoteRankings($sortBy: String, $limit: Int, $offset: Int) {
    adminClauseVoteRankings(sortBy: $sortBy, limit: $limit, offset: $offset) {
      items {
        clauseId
        clauseNumber
        clauseText { fa en }
        countryName { fa en }
        chapterTitle { fa en }
        articleTitle { fa en }
        voteSummary { agree disagree total }
      }
      total
      limit
      offset
    }
  }
`;
