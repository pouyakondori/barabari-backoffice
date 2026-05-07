import { gql } from '@apollo/client';

export const ADMIN_AUDIT_LOGS = gql`
  query AdminAuditLogs(
    $adminId: ID,
    $action: String,
    $entityType: String,
    $dateRange: DateRangeInput,
    $limit: Int,
    $offset: Int
  ) {
    adminAuditLogs(
      adminId: $adminId,
      action: $action,
      entityType: $entityType,
      dateRange: $dateRange,
      limit: $limit,
      offset: $offset
    ) {
      items {
        id
        admin {
          id
          displayName
          email
        }
        action
        entityType
        entityId
        details
        createdAt
      }
      total
      limit
      offset
    }
  }
`;
