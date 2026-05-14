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
import { useTranslation } from '@/locale';
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
  const { t } = useTranslation();
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
    onCompleted: () => message.success(t("comments.approved")),
  });
  const [rejectComment, { loading: rejecting }] = useMutation(ADMIN_REJECT_COMMENT, {
    ...mutationOpts,
    onCompleted: () => message.success(t("comments.rejected")),
  });
  const [deleteComment, { loading: deletingOne }] = useMutation(ADMIN_DELETE_COMMENT, {
    ...mutationOpts,
    onCompleted: () => message.success(t("comments.deleted")),
  });
  const [restoreComment, { loading: restoring }] = useMutation(ADMIN_RESTORE_COMMENT, {
    ...mutationOpts,
    onCompleted: () => message.success(t("comments.restored")),
  });
  const [bulkApprove, { loading: bulkApproving }] = useMutation(ADMIN_BULK_APPROVE_COMMENTS, {
    ...mutationOpts,
    onCompleted: () => {
      message.success(t("comments.bulk_approved"));
      setSelectedRowKeys([]);
    },
  });
  const [bulkReject, { loading: bulkRejecting }] = useMutation(ADMIN_BULK_REJECT_COMMENTS, {
    ...mutationOpts,
    onCompleted: () => {
      message.success(t("comments.bulk_rejected"));
      setSelectedRowKeys([]);
    },
  });
  const [bulkDelete, { loading: bulkDeleting }] = useMutation(ADMIN_BULK_DELETE_COMMENTS, {
    ...mutationOpts,
    onCompleted: () => {
      message.success(t("comments.bulk_deleted"));
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
          <Tooltip title={t("comments.approve_tooltip")}>
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
          <Tooltip title={t("comments.reject_tooltip")}>
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
          <Tooltip title={t("comments.restore_tooltip")}>
            <Button
              type="link"
              icon={<UndoOutlined />}
              onClick={() => restoreComment({ variables: { id } })}
              loading={restoring}
            />
          </Tooltip>
        ) : (
          <Tooltip title={t("comments.delete_tooltip")}>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                openConfirm(
                  t("comments.delete_title"),
                  t("comments.delete_confirm"),
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
      title: t("comments.user"),
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
      title: t("comments.comment"),
      dataIndex: 'text',
      ellipsis: true,
      render: (text: string) => (
        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0, maxWidth: 400 }}>
          {text}
        </Paragraph>
      ),
    },
    {
      title: t("comments.clause"),
      dataIndex: 'clauseId',
      width: 120,
      render: (clauseId: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {clauseId.slice(0, 8)}...
        </Text>
      ),
    },
    {
      title: t("comments.status"),
      dataIndex: 'status',
      width: 100,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: t("comments.date"),
      dataIndex: 'createdAt',
      width: 130,
      render: (date: string) => formatDate(date),
      sorter: (a: Comment, b: Comment) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: t("comments.actions"),
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
          <span style={{ padding: '0 8px' }}>{t("comments.pending")}</span>
        </Badge>
      ),
      value: 'pending',
    },
    { label: t("comments.approved_label"), value: 'approved' },
    { label: t("comments.rejected_label"), value: 'rejected' },
    { label: t("comments.deleted_label"), value: 'deleted' },
    { label: t("comments.all"), value: 'all' },
  ];

  const bulkToolbar = selectedRowKeys.length > 0 && (
    <Space style={{ marginBottom: 16 }}>
      <Text strong>{selectedRowKeys.length} {t("comments.selected")}</Text>
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={() =>
          openConfirm(
            t("comments.bulk_approve"),
            `${t("comments.bulk_approve")} ${selectedRowKeys.length}?`,
            () => bulkApprove({ variables: { ids: selectedRowKeys } }),
          )
        }
        loading={bulkApproving}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        {t("comments.bulk_approve")}
      </Button>
      <Button
        icon={<CloseCircleOutlined />}
        onClick={() =>
          openConfirm(
            t("comments.bulk_reject"),
            `${t("comments.bulk_reject")} ${selectedRowKeys.length}?`,
            () => bulkReject({ variables: { ids: selectedRowKeys } }),
          )
        }
        loading={bulkRejecting}
      >
        {t("comments.bulk_reject")}
      </Button>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() =>
          openConfirm(
            t("comments.bulk_delete"),
            `${t("comments.bulk_delete")} ${selectedRowKeys.length}?`,
            () => bulkDelete({ variables: { ids: selectedRowKeys } }),
            true,
          )
        }
        loading={bulkDeleting}
      >
        {t("comments.bulk_delete")}
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
          <Text type="secondary">{total} {t("comments.total_label")}</Text>
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
