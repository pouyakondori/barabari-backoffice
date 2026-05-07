import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Select, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import ConfirmModal from '@/components/common/ConfirmModal';
import { usePagination } from '@/hooks/usePagination';
import { localized, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { GET_TIMELINE_EVENTS } from '@/graphql/queries/timeline';
import { GET_COUNTRIES } from '@/graphql/queries/countries';
import { DELETE_TIMELINE_EVENT } from '@/graphql/mutations/timeline';
import type { TimelineEvent, PaginatedResult, Country } from '@/types';

export default function TimelineList() {
  const navigate = useNavigate();
  const pagination = usePagination();
  const [countryFilter, setCountryFilter] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<TimelineEvent | null>(null);

  const { data, loading } = useQuery<{ timelineEvents: PaginatedResult<TimelineEvent> }>(
    GET_TIMELINE_EVENTS,
    {
      variables: {
        limit: pagination.pageSize,
        offset: pagination.offset,
        countryId: countryFilter,
      },
    },
  );

  const { data: countriesData } = useQuery<{ countries: PaginatedResult<Country> }>(GET_COUNTRIES, {
    variables: { limit: 100, offset: 0 },
  });

  const [deleteEvent, { loading: deleting }] = useMutation(DELETE_TIMELINE_EVENT, {
    refetchQueries: [{ query: GET_TIMELINE_EVENTS }],
    onCompleted: () => {
      message.success('Event deleted successfully');
      setDeleteTarget(null);
    },
    onError: (err: any) => message.error(err.message),
  });

  const columns: ColumnsType<TimelineEvent> = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (_: unknown, record: TimelineEvent) => localized(record.title),
    },
    {
      title: 'Country',
      dataIndex: ['country', 'name'],
      width: 140,
      render: (_: unknown, record: TimelineEvent) => localized(record.country.name),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 130,
      render: (date: string) => formatDate(date),
      sorter: (a: TimelineEvent, b: TimelineEvent) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Order',
      dataIndex: 'order',
      width: 80,
      sorter: (a: TimelineEvent, b: TimelineEvent) => a.order - b.order,
    },
    {
      title: 'Actions',
      width: 120,
      render: (_: unknown, record: TimelineEvent) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(ROUTES.TIMELINE_EDIT.replace(':id', record.id))}
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

  const events = data?.timelineEvents.items ?? [];
  const total = data?.timelineEvents.total ?? 0;

  const countryOptions = (countriesData?.countries.items ?? []).map((c: any) => ({
    label: localized(c.name),
    value: c.id,
  }));

  return (
    <div>
      <DataTable<TimelineEvent>
        columns={columns}
        dataSource={events}
        loading={loading}
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
              style={{ width: 180 }}
              value={countryFilter}
              onChange={(val) => {
                setCountryFilter(val);
                pagination.reset();
              }}
              options={countryOptions}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTES.TIMELINE_CREATE)}
            >
              Add Event
            </Button>
          </Space>
        }
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Event"
        content={`Are you sure you want to delete "${deleteTarget ? localized(deleteTarget.title) : ''}"?`}
        onConfirm={() => {
          if (deleteTarget) {
            deleteEvent({ variables: { id: deleteTarget.id } });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
