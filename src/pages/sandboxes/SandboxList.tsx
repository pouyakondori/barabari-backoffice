import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Modal, Space, Typography, message } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import ConfirmModal from '@/components/common/ConfirmModal';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate, localized } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { ADMIN_SANDBOXES } from '@/graphql/queries/sandboxes';
import { ADMIN_DELETE_SANDBOX } from '@/graphql/mutations/sandboxes';
import type { PaginatedResult } from '@/types';

const { Text, Paragraph } = Typography;

interface SandboxClause {
  id: string;
  number: number;
  text: { fa: string; en: string };
}

interface Sandbox {
  id: string;
  title: string;
  user: { id: string; displayName: string; email: string };
  clauseCount: number;
  clauses: SandboxClause[];
  createdAt: string;
}

export default function SandboxList() {
  const { t } = useTranslation();
  const pagination = usePagination();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Sandbox | null>(null);
  const [viewTarget, setViewTarget] = useState<Sandbox | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, loading } = useQuery<{ adminSandboxes: PaginatedResult<Sandbox> }>(
    ADMIN_SANDBOXES,
    {
      variables: {
        limit: pagination.pageSize,
        offset: pagination.offset,
        search: debouncedSearch || undefined,
      },
    },
  );

  const [deleteSandbox, { loading: deleting }] = useMutation(ADMIN_DELETE_SANDBOX, {
    refetchQueries: [{ query: ADMIN_SANDBOXES }],
    onCompleted: () => {
      message.success(t("sandboxes.sandbox_deleted"));
      setDeleteTarget(null);
    },
    onError: (err: any) => message.error(err.message),
  });

  const columns: ColumnsType<Sandbox> = [
    {
      title: t("sandboxes.user"),
      dataIndex: 'user',
      render: (_: unknown, record: Sandbox) => (
        <div>
          <Text strong>{record.user.displayName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.user.email}
          </Text>
        </div>
      ),
    },
    {
      title: t("sandboxes.title"),
      dataIndex: 'title',
    },
    {
      title: t("sandboxes.clauses"),
      dataIndex: 'clauseCount',
      width: 90,
    },
    {
      title: t("sandboxes.created"),
      dataIndex: 'createdAt',
      width: 130,
      render: (date: string) => formatDate(date),
      sorter: (a: Sandbox, b: Sandbox) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: t("sandboxes.actions"),
      width: 120,
      render: (_: unknown, record: Sandbox) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setViewTarget(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteTarget(record)}
          />
        </Space>
      ),
    },
  ];

  const sandboxes = data?.adminSandboxes.items ?? [];
  const total = data?.adminSandboxes.total ?? 0;

  return (
    <div>
      <DataTable<Sandbox>
        columns={columns}
        dataSource={sandboxes}
        loading={loading}
        searchPlaceholder={t("sandboxes.search_placeholder")}
        onSearch={setSearch}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: pagination.onChange,
        }}
      />

      <Modal
        open={!!viewTarget}
        title={`${t("sandboxes.sandbox")}: ${viewTarget?.title ?? ''}`}
        onCancel={() => setViewTarget(null)}
        footer={<Button onClick={() => setViewTarget(null)}>{t("sandboxes.close")}</Button>}
        width={640}
      >
        {viewTarget && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">{t("sandboxes.user_label")} </Text>
              <Text strong>{viewTarget.user.displayName}</Text>
              <Text type="secondary"> ({viewTarget.user.email})</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">{t("sandboxes.created_label")} </Text>
              <Text>{formatDate(viewTarget.createdAt)}</Text>
            </div>
            <div>
              <Text strong>Clauses ({viewTarget.clauses.length}):</Text>
              {viewTarget.clauses.map((clause) => (
                <div
                  key={clause.id}
                  style={{
                    padding: '8px 12px',
                    marginTop: 8,
                    background: '#f5f5f5',
                    borderRadius: 6,
                  }}
                >
                  <Text type="secondary">#{clause.number}</Text>
                  <Paragraph style={{ marginBottom: 0, marginTop: 4 }}>
                    {localized(clause.text)}
                  </Paragraph>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title={t("sandboxes.delete_sandbox")}
        content={`${t("sandboxes.confirm_delete")} "${deleteTarget?.title ?? ''}"?`}
        onConfirm={() => {
          if (deleteTarget) {
            deleteSandbox({ variables: { id: deleteTarget.id } });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
