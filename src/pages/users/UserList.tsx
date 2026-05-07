import { useState, useMemo } from 'react';
import { Button, Select, Space, Tag, message } from 'antd';
import {
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { User, PaginatedResult } from '@/types';
import { ADMIN_USERS } from '@/graphql/queries/users';
import { ADMIN_BAN_USER, ADMIN_UNBAN_USER, ADMIN_DELETE_USER } from '@/graphql/mutations/users';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { useTranslation } from '@/locale';

export function UserList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pagination = usePagination();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data, loading, refetch } = useQuery<{ adminUsers: PaginatedResult<User> }>(ADMIN_USERS, {
    variables: {
      limit: pagination.pageSize,
      offset: pagination.offset,
      search: debouncedSearch || undefined,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    },
  });

  const [banUser] = useMutation(ADMIN_BAN_USER);
  const [unbanUser] = useMutation(ADMIN_UNBAN_USER);
  const [deleteUser, { loading: deleteLoading }] = useMutation(ADMIN_DELETE_USER);

  const users = data?.adminUsers?.items ?? [];
  const total = data?.adminUsers?.total ?? 0;

  const handleToggleBan = async (user: User) => {
    try {
      if (user.isBanned) {
        await unbanUser({ variables: { id: user.id } });
        void message.success(`${user.displayName} ${t("users.unbanned")}`);
      } else {
        await banUser({ variables: { id: user.id } });
        void message.success(`${user.displayName} ${t("users.was_banned")}`);
      }
      await refetch();
    } catch {
      void message.error(t("users.operation_error"));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser({ variables: { id: deleteTarget.id } });
      void message.success(t("users.user_deleted"));
      setDeleteTarget(null);
      await refetch();
    } catch {
      void message.error(t("users.delete_error"));
    }
  };

  const handleBulkBan = async () => {
    try {
      await Promise.all(selectedIds.map((id) => banUser({ variables: { id } })));
      void message.success(`${selectedIds.length} ${t("users.bulk_banned")}`);
      setSelectedIds([]);
      await refetch();
    } catch {
      void message.error(t("users.bulk_ban_error"));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteUser({ variables: { id } })));
      void message.success(`${selectedIds.length} ${t("users.bulk_deleted")}`);
      setSelectedIds([]);
      await refetch();
    } catch {
      void message.error(t("users.bulk_delete_error"));
    }
  };

  const columns: ColumnsType<User> = useMemo(() => [
    {
      title: t("users.display_name"),
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: t("users.email"),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t("users.role"),
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <StatusBadge status={role} />,
    },
    {
      title: t("users.verified"),
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (v: boolean) => (v ? <Tag color="green">{t("users.yes")}</Tag> : <Tag color="orange">{t("users.no")}</Tag>),
    },
    {
      title: t("users.banned"),
      dataIndex: 'isBanned',
      key: 'isBanned',
      render: (v: boolean) => (v ? <Tag color="red">{t("users.banned")}</Tag> : <Tag color="green">{t("users.active")}</Tag>),
    },
    {
      title: t("users.join_date"),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => formatDate(d),
    },
    {
      title: t("users.actions"),
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(ROUTES.USER_DETAIL.replace(':id', record.id))}
          />
          <Button
            type="link"
            size="small"
            icon={record.isBanned ? <CheckCircleOutlined /> : <StopOutlined />}
            danger={!record.isBanned}
            onClick={() => void handleToggleBan(record)}
          />
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteTarget(record)}
          />
        </Space>
      ),
    },
  ], [navigate]);

  const filterBar = (
    <Space>
      <Select
        value={roleFilter}
        onChange={setRoleFilter}
        style={{ width: 120 }}
        options={[
          { value: 'all', label: t("users.all_roles") },
          { value: 'user', label: t("users.user") },
          { value: 'admin', label: t("users.admin") },
        ]}
      />
      <Select
        value={statusFilter}
        onChange={setStatusFilter}
        style={{ width: 120 }}
        options={[
          { value: 'all', label: t("users.all_statuses") },
          { value: 'active', label: t("users.active") },
          { value: 'banned', label: t("users.banned") },
        ]}
      />
    </Space>
  );

  const bulkBar = selectedIds.length > 0 ? (
    <Space style={{ marginBottom: 16 }}>
      <span>{selectedIds.length} {t("users.items_selected")}</span>
      <Button size="small" danger icon={<StopOutlined />} onClick={() => void handleBulkBan()}>
        {t("users.bulk_ban")}
      </Button>
      <Button size="small" danger icon={<DeleteOutlined />} onClick={() => void handleBulkDelete()}>
        {t("users.bulk_delete")}
      </Button>
    </Space>
  ) : null;

  return (
    <div>
      {bulkBar}
      <DataTable<User>
        columns={columns}
        dataSource={users}
        loading={loading}
        searchPlaceholder={t("users.search_placeholder")}
        onSearch={setSearch}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: pagination.onChange,
        }}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (keys) => setSelectedIds(keys as string[]),
        }}
        extra={filterBar}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title={t("users.delete_user")}
        content={`${t("users.delete_confirm_prefix")}${deleteTarget?.displayName ?? ''}${t("users.delete_confirm_suffix")}`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
        danger
      />
    </div>
  );
}

export default UserList;
