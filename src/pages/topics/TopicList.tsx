import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Select, Space, Tag, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import ConfirmModal from '@/components/common/ConfirmModal';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { localized } from '@/utils/formatters';
import { ROUTES, TOPIC_CATEGORIES } from '@/utils/constants';
import { GET_TOPICS } from '@/graphql/queries/topics';
import { ADMIN_DELETE_TOPIC } from '@/graphql/mutations/topics';
import type { Topic, PaginatedResult } from '@/types';

export default function TopicList() {
  const navigate = useNavigate();
  const pagination = usePagination();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, loading } = useQuery<{ topics: PaginatedResult<Topic> }>(GET_TOPICS, {
    variables: {
      limit: pagination.pageSize,
      offset: pagination.offset,
      search: debouncedSearch || undefined,
      category,
    },
  });

  const [deleteTopic, { loading: deleting }] = useMutation(ADMIN_DELETE_TOPIC, {
    refetchQueries: [{ query: GET_TOPICS }],
    onCompleted: () => {
      message.success('Topic deleted successfully');
      setDeleteTarget(null);
    },
    onError: (err: any) => message.error(err.message),
  });

  const columns: ColumnsType<Topic> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_: unknown, record: Topic) => localized(record.name),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Order',
      dataIndex: 'order',
      width: 80,
      sorter: (a: Topic, b: Topic) => a.order - b.order,
    },
    {
      title: 'Clauses',
      dataIndex: 'clauseCount',
      width: 90,
      render: (val: number | undefined) => val ?? 0,
    },
    {
      title: 'Actions',
      width: 120,
      render: (_: unknown, record: Topic) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(ROUTES.TOPIC_EDIT.replace(':id', record.id))}
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

  const topics = data?.topics.items ?? [];
  const total = data?.topics.total ?? 0;

  return (
    <div>
      <DataTable<Topic>
        columns={columns}
        dataSource={topics}
        loading={loading}
        searchPlaceholder="Search topics..."
        onSearch={setSearch}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: pagination.onChange,
        }}
        extra={
          <Space>
            <Select
              placeholder="Filter by category"
              allowClear
              style={{ width: 200 }}
              value={category}
              onChange={(val) => {
                setCategory(val);
                pagination.reset();
              }}
              options={TOPIC_CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTES.TOPIC_CREATE)}
            >
              Add Topic
            </Button>
          </Space>
        }
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Topic"
        content={`Are you sure you want to delete "${deleteTarget ? localized(deleteTarget.name) : ''}"?`}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTopic({ variables: { id: deleteTarget.id } });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
