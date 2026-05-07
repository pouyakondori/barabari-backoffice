import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  Avatar,
  Badge,
  Button,
  Segmented,
  Space,
  Tooltip,
  Typography,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/formatters';
import { ADMIN_COMMENTS, ADMIN_PENDING_COUNT } from '@/graphql/queries/comments';
import {
  ADMIN_APPROVE_COMMENT,
  ADMIN_REJECT_COMMENT,
  ADMIN_DELETE_COMMENT,
  ADMIN_RESTORE_COMMENT,
  ADMIN_BULK_APPROVE_COMMENTS,
  ADMIN_BULK_REJECT_COMMENTS,
  ADMIN_BULK_DELETE_COMMENTS,
} from '@/graphql/mutations/comments';
import type { Comment, PaginatedResult } from '@/types';

const { Text, Paragraph } = Typography;

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'deleted' | 'all';

const REFETCH = [
  { query: ADMIN_COMMENTS },
  { query: ADMIN_PENDING_COUNT },
];

export default function CommentModeration() {
  const pagination = usePagination();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    content: string;
    action: () => void;
    danger: boolean;
  }>({ open: false, title: '', content: '', action: () => {}, danger: false });

  const { data, loading } = useQuery<{ adminComments: PaginatedResult<Comment> }>(
    ADMIN_COMMENTS,
    {
      variables: {
        limit: pagination.pageSize,
        offset: pagination.offset,
        status: statusFilter === 'all' ? undefined : statusFilter,
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const { data: pendingData } = useQuery<{ adminPendingCount: number }>(ADMIN_PENDING_COUNT);
  const pendingCount = pendingData?.adminPendingCount ?? 0;

  const mutationOpts = {
    refetchQueries: REFETCH,
    onError: (err: Error) => message.error(err.message),
  };

  const [approveComment, { loading: approving }] = useMutation(ADMIN_APPROVE_COMMENT, {
    ...mutationOpts,
    onCompleted: () => message.success('Comment approved'),
  });
  const [rejectComment, { loading: rejecting }] = useMutation(ADMIN_REJECT_COMMENT, {
    ...mutationOpts,
    onCompleted: () => message.success('Comment rejected'),
  });
  const [deleteComment, { loading: deletingOne }] = useMutation(ADMIN_DELETE_COMMENT, {
    ...mutationOpts,
    onCompleted: () => message.success('Comment deleted'),
  });
  const [restoreComment, { loading: restoring }] = useMutation(ADMIN_RESTORE_COMMENT, {
    ...mutationOpts,
    onCompleted: () => message.success('Comment restored'),
  });
  const [bulkApprove, { loading: bulkApproving }] = useMutation(ADMIN_BULK_APPROVE_COMMENTS, {
    ...mutationOpts,
    onCompleted: () => {
      message.success('Comments approved');
      setSelectedRowKeys([]);
    },
  });
  const [bulkReject, { loading: bulkRejecting }] = useMutation(ADMIN_BULK_REJECT_COMMENTS, {
    ...mutationOpts,
    onCompleted: () => {
      message.success('Comments rejected');
      setSelectedRowKeys([]);
    },
  });
  const [bulkDelete, { loading: bulkDeleting }] = useMutation(ADMIN_BULK_DELETE_COMMENTS, {
    ...mutationOpts,
    onCompleted: () => {
      message.success('Comments deleted');
      setSelectedRowKeys([]);
    },
  });

  const isMutating =
    approving || rejecting || deletingOne || restoring ||
    bulkApproving || bulkRejecting || bulkDeleting;

  const openConfirm = (title: string, content: string, action: () => void, danger = false) => {
    setConfirmModal({ open: true, title, content, action, danger });
  };

  const renderActions = (record: Comment) => {
    const { status, id } = record;
    return (
      <Space size="small">
        {(status === 'pending' || status === 'rejected') && (
          <Tooltip title="Approve">
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => approveComment({ variables: { id } })}
              loading={approving}
            />
          </Tooltip>
        )}
        {(status === 'pending' || status === 'approved') && (
          <Tooltip title="Reject">
            <Button
              type="link"
              icon={<CloseCircleOutlined />}
              style={{ color: '#ff4d4f' }}
              onClick={() => rejectComment({ variables: { id } })}
              loading={rejecting}
            />
          </Tooltip>
        )}
        {status === 'deleted' ? (
          <Tooltip title="Restore">
            <Button
              type="link"
              icon={<UndoOutlined />}
              onClick={() => restoreComment({ variables: { id } })}
              loading={restoring}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                openConfirm(
                  'Delete Comment',
                  'Are you sure you want to delete this comment?',
                  () => deleteComment({ variables: { id } }),
                  true,
                )
              }
            />
          </Tooltip>
        )}
      </Space>
    );
  };

  const columns: ColumnsType<Comment> = [
    {
      title: 'User',
      dataIndex: 'user',
      width: 180,
      render: (_: unknown, record: Comment) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.user.displayName}</Text>
        </Space>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'text',
      ellipsis: true,
      render: (text: string) => (
        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0, maxWidth: 400 }}>
          {text}
        </Paragraph>
      ),
    },
    {
      title: 'Clause',
      dataIndex: 'clauseId',
      width: 120,
      render: (clauseId: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {clauseId.slice(0, 8)}...
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      width: 130,
      render: (date: string) => formatDate(date),
      sorter: (a: Comment, b: Comment) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Actions',
      width: 140,
      render: (_: unknown, record: Comment) => renderActions(record),
    },
  ];

  const comments = data?.adminComments.items ?? [];
  const total = data?.adminComments.total ?? 0;

  const statusOptions: { label: React.ReactNode; value: StatusFilter }[] = [
    {
      label: (
        <Badge count={pendingCount} size="small" offset={[8, -2]}>
          <span style={{ padding: '0 8px' }}>Pending</span>
        </Badge>
      ),
      value: 'pending',
    },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Deleted', value: 'deleted' },
    { label: 'All', value: 'all' },
  ];

  const bulkToolbar = selectedRowKeys.length > 0 && (
    <Space style={{ marginBottom: 16 }}>
      <Text strong>{selectedRowKeys.length} selected</Text>
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={() =>
          openConfirm(
            'Bulk Approve',
            `Approve ${selectedRowKeys.length} comments?`,
            () => bulkApprove({ variables: { ids: selectedRowKeys } }),
          )
        }
        loading={bulkApproving}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        Bulk Approve
      </Button>
      <Button
        icon={<CloseCircleOutlined />}
        onClick={() =>
          openConfirm(
            'Bulk Reject',
            `Reject ${selectedRowKeys.length} comments?`,
            () => bulkReject({ variables: { ids: selectedRowKeys } }),
          )
        }
        loading={bulkRejecting}
      >
        Bulk Reject
      </Button>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() =>
          openConfirm(
            'Bulk Delete',
            `Delete ${selectedRowKeys.length} comments?`,
            () => bulkDelete({ variables: { ids: selectedRowKeys } }),
            true,
          )
        }
        loading={bulkDeleting}
      >
        Bulk Delete
      </Button>
    </Space>
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Segmented
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val as StatusFilter);
            setSelectedRowKeys([]);
            pagination.reset();
          }}
        />
      </div>

      {bulkToolbar}

      <DataTable<Comment>
        columns={columns}
        dataSource={comments}
        loading={loading || isMutating}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: pagination.onChange,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        extra={
          <Text type="secondary">{total} comments</Text>
        }
      />

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        content={confirmModal.content}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal((s) => ({ ...s, open: false }));
        }}
        onCancel={() => setConfirmModal((s) => ({ ...s, open: false }))}
        danger={confirmModal.danger}
      />
    </div>
  );
}
