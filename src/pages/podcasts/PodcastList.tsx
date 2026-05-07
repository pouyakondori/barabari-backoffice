import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Select, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import ConfirmModal from '@/components/common/ConfirmModal';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { localized, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { ADMIN_PODCASTS } from '@/graphql/queries/podcasts';
import { GET_TOPICS } from '@/graphql/queries/topics';
import { GET_COUNTRIES } from '@/graphql/queries/countries';
import { ADMIN_DELETE_PODCAST } from '@/graphql/mutations/podcasts';
import type { Podcast, PaginatedResult, Country, Topic } from '@/types';

export default function PodcastList() {
  const navigate = useNavigate();
  const pagination = usePagination();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string | undefined>();
  const [topicFilter, setTopicFilter] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Podcast | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, loading } = useQuery<{ podcasts: PaginatedResult<Podcast> }>(ADMIN_PODCASTS, {
    variables: {
      limit: pagination.pageSize,
      offset: pagination.offset,
      search: debouncedSearch || undefined,
      countryId: countryFilter,
      topicId: topicFilter,
    },
  });

  const { data: countriesData } = useQuery<{ countries: PaginatedResult<Country> }>(GET_COUNTRIES, {
    variables: { limit: 100, offset: 0 },
  });

  const { data: topicsData } = useQuery<{ topics: PaginatedResult<Topic> }>(GET_TOPICS, {
    variables: { limit: 100, offset: 0 },
  });

  const [deletePodcast, { loading: deleting }] = useMutation(ADMIN_DELETE_PODCAST, {
    refetchQueries: [{ query: ADMIN_PODCASTS }],
    onCompleted: () => {
      message.success('Podcast deleted successfully');
      setDeleteTarget(null);
    },
    onError: (err: any) => message.error(err.message),
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const columns: ColumnsType<Podcast> = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (_: unknown, record: Podcast) => localized(record.title),
    },
    {
      title: 'Country',
      dataIndex: ['country', 'name'],
      width: 120,
      render: (_: unknown, record: Podcast) =>
        record.country ? localized(record.country.name) : '—',
    },
    {
      title: 'Topic',
      dataIndex: ['topic', 'name'],
      width: 140,
      render: (_: unknown, record: Podcast) =>
        record.topic ? localized(record.topic.name) : '—',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      width: 90,
      render: (val: number) => formatDuration(val),
    },
    {
      title: 'Published',
      dataIndex: 'publishedAt',
      width: 120,
      render: (date: string) => formatDate(date),
      sorter: (a: Podcast, b: Podcast) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
    },
    {
      title: 'Actions',
      width: 120,
      render: (_: unknown, record: Podcast) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(ROUTES.PODCAST_EDIT.replace(':id', record.id))}
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

  const podcasts = data?.podcasts.items ?? [];
  const total = data?.podcasts.total ?? 0;

  const countryOptions = (countriesData?.countries.items ?? []).map((c: any) => ({
    label: localized(c.name),
    value: c.id,
  }));

  const topicOptions = (topicsData?.topics.items ?? []).map((t: any) => ({
    label: localized(t.name),
    value: t.id,
  }));

  return (
    <div>
      <DataTable<Podcast>
        columns={columns}
        dataSource={podcasts}
        loading={loading}
        searchPlaceholder="Search podcasts..."
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
              placeholder="Filter by country"
              allowClear
              style={{ width: 160 }}
              value={countryFilter}
              onChange={(val) => {
                setCountryFilter(val);
                pagination.reset();
              }}
              options={countryOptions}
            />
            <Select
              placeholder="Filter by topic"
              allowClear
              style={{ width: 160 }}
              value={topicFilter}
              onChange={(val) => {
                setTopicFilter(val);
                pagination.reset();
              }}
              options={topicOptions}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTES.PODCAST_CREATE)}
            >
              Add Podcast
            </Button>
          </Space>
        }
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Podcast"
        content={`Are you sure you want to delete "${deleteTarget ? localized(deleteTarget.title) : ''}"?`}
        onConfirm={() => {
          if (deleteTarget) {
            deletePodcast({ variables: { id: deleteTarget.id } });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
