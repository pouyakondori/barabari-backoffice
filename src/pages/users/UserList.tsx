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

export function UserList() {
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
        void message.success(`${user.displayName} رفع مسدودی شد`);
      } else {
        await banUser({ variables: { id: user.id } });
        void message.success(`${user.displayName} مسدود شد`);
      }
      await refetch();
    } catch {
      void message.error('خطا در انجام عملیات');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser({ variables: { id: deleteTarget.id } });
      void message.success('کاربر حذف شد');
      setDeleteTarget(null);
      await refetch();
    } catch {
      void message.error('خطا در حذف کاربر');
    }
  };

  const handleBulkBan = async () => {
    try {
      await Promise.all(selectedIds.map((id) => banUser({ variables: { id } })));
      void message.success(`${selectedIds.length} کاربر مسدود شدند`);
      setSelectedIds([]);
      await refetch();
    } catch {
      void message.error('خطا در مسدودسازی گروهی');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteUser({ variables: { id } })));
      void message.success(`${selectedIds.length} کاربر حذف شدند`);
      setSelectedIds([]);
      await refetch();
    } catch {
      void message.error('خطا در حذف گروهی');
    }
  };

  const columns: ColumnsType<User> = useMemo(() => [
    {
      title: 'نام نمایشی',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: 'ایمیل',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'نقش',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <StatusBadge status={role} />,
    },
    {
      title: 'تایید شده',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (v: boolean) => (v ? <Tag color="green">بله</Tag> : <Tag color="orange">خیر</Tag>),
    },
    {
      title: 'مسدود',
      dataIndex: 'isBanned',
      key: 'isBanned',
      render: (v: boolean) => (v ? <Tag color="red">مسدود</Tag> : <Tag color="green">فعال</Tag>),
    },
    {
      title: 'تاریخ عضویت',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => formatDate(d),
    },
    {
      title: 'عملیات',
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
          { value: 'all', label: 'همه نقش‌ها' },
          { value: 'user', label: 'کاربر' },
          { value: 'admin', label: 'ادمین' },
        ]}
      />
      <Select
        value={statusFilter}
        onChange={setStatusFilter}
        style={{ width: 120 }}
        options={[
          { value: 'all', label: 'همه وضعیت‌ها' },
          { value: 'active', label: 'فعال' },
          { value: 'banned', label: 'مسدود' },
        ]}
      />
    </Space>
  );

  const bulkBar = selectedIds.length > 0 ? (
    <Space style={{ marginBottom: 16 }}>
      <span>{selectedIds.length} مورد انتخاب شده</span>
      <Button size="small" danger icon={<StopOutlined />} onClick={() => void handleBulkBan()}>
        مسدودسازی گروهی
      </Button>
      <Button size="small" danger icon={<DeleteOutlined />} onClick={() => void handleBulkDelete()}>
        حذف گروهی
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
        searchPlaceholder="جستجو بر اساس نام یا ایمیل..."
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
        title="حذف کاربر"
        content={`آیا از حذف کاربر «${deleteTarget?.displayName ?? ''}» مطمئن هستید؟`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
        danger
      />
    </div>
  );
}

export default UserList;
