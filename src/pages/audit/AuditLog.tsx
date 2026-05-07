import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { DatePicker, Select, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import DataTable from '@/components/common/DataTable';
import { usePagination } from '@/hooks/usePagination';
import { useTranslation } from '@/locale';
import { formatDate } from '@/utils/formatters';
import { ADMIN_AUDIT_LOGS } from '@/graphql/queries/auditLogs';
import type { AuditLog, PaginatedResult } from '@/types';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ACTION_COLORS: Record<string, string> = {
  create: 'green',
  update: 'blue',
  delete: 'red',
  approve: 'cyan',
  reject: 'orange',
  ban: 'red',
  unban: 'green',
};

const ACTION_OPTIONS = [
  'create', 'update', 'delete', 'approve', 'reject', 'ban', 'unban',
].map((a) => ({ label: a, value: a }));

const ENTITY_TYPE_OPTIONS = [
  'country', 'constitution', 'topic', 'comment', 'user', 'podcast', 'timeline', 'settings',
].map((e) => ({ label: e, value: e }));

export default function AuditLogPage() {
  const { t } = useTranslation();
  const pagination = usePagination();
  const [actionFilter, setActionFilter] = useState<string | undefined>();
  const [entityTypeFilter, setEntityTypeFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const { data, loading } = useQuery<{ adminAuditLogs: PaginatedResult<AuditLog> }>(
    ADMIN_AUDIT_LOGS,
    {
      variables: {
        limit: pagination.pageSize,
        offset: pagination.offset,
        action: actionFilter,
        entityType: entityTypeFilter,
        startDate: dateRange?.[0]?.toISOString(),
        endDate: dateRange?.[1]?.toISOString(),
      },
    },
  );

  const columns: ColumnsType<AuditLog> = [
    {
      title: t("audit.admin"),
      dataIndex: ['admin', 'displayName'],
      width: 150,
      render: (_: unknown, record: AuditLog) => (
        <Text strong>{record.admin.displayName}</Text>
      ),
    },
    {
      title: t("audit.action"),
      dataIndex: 'action',
      width: 100,
      render: (action: string) => (
        <Tag color={ACTION_COLORS[action] ?? 'default'}>{action}</Tag>
      ),
    },
    {
      title: t("audit.entity_type"),
      dataIndex: 'entityType',
      width: 120,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: t("audit.entity_id"),
      dataIndex: 'entityId',
      width: 130,
      render: (id: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {id.length > 12 ? `${id.slice(0, 12)}...` : id}
        </Text>
      ),
    },
    {
      title: t("audit.date"),
      dataIndex: 'createdAt',
      width: 140,
      render: (date: string) => formatDate(date, 'YYYY/MM/DD HH:mm'),
      sorter: (a: AuditLog, b: AuditLog) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: t("audit.details"),
      dataIndex: 'details',
      ellipsis: true,
      render: (details: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {details}
        </Text>
      ),
    },
  ];

  const logs = data?.adminAuditLogs.items ?? [];
  const total = data?.adminAuditLogs.total ?? 0;

  return (
    <div>
      <DataTable<AuditLog>
        columns={columns}
        dataSource={logs}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: pagination.onChange,
        }}
        extra={
          <Space wrap>
            <Select
              placeholder={t("audit.action")}
              allowClear
              style={{ width: 130 }}
              value={actionFilter}
              onChange={(val) => {
                setActionFilter(val);
                pagination.reset();
              }}
              options={ACTION_OPTIONS}
            />
            <Select
              placeholder={t("audit.entity_type_filter")}
              allowClear
              style={{ width: 140 }}
              value={entityTypeFilter}
              onChange={(val) => {
                setEntityTypeFilter(val);
                pagination.reset();
              }}
              options={ENTITY_TYPE_OPTIONS}
            />
            <RangePicker
              onChange={(dates) => {
                setDateRange(dates);
                pagination.reset();
              }}
            />
          </Space>
        }
      />
    </div>
  );
}
