import { useState, useMemo } from 'react';
import { Button, Space, Avatar, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { Country } from '@/types';
import { GET_COUNTRIES } from '@/graphql/queries/countries';
import { ADMIN_DELETE_COUNTRY } from '@/graphql/mutations/countries';
import DataTable from '@/components/common/DataTable';
import ConfirmModal from '@/components/common/ConfirmModal';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { localized, formatNumber } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

export function CountryList() {
  const navigate = useNavigate();
  const pagination = usePagination();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Country | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data, loading, refetch } = useQuery<{ countries: Country[] }>(GET_COUNTRIES, {
    variables: {
      limit: pagination.pageSize,
      offset: pagination.offset,
      search: debouncedSearch || undefined,
    },
  });

  const [deleteCountry, { loading: deleteLoading }] = useMutation(ADMIN_DELETE_COUNTRY);

  const countries = data?.countries ?? [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCountry({ variables: { id: deleteTarget.id } });
      void message.success('کشور حذف شد');
      setDeleteTarget(null);
      await refetch();
    } catch {
      void message.error('خطا در حذف کشور');
    }
  };

  const columns: ColumnsType<Country> = useMemo(() => [
    {
      title: 'پرچم',
      dataIndex: 'flag',
      key: 'flag',
      width: 60,
      render: (flag: string) => <Avatar src={flag} shape="square" size="small" />,
    },
    {
      title: 'نام',
      key: 'name',
      render: (_: unknown, record: Country) => localized(record.name),
    },
    {
      title: 'اسلاگ',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'جمعیت',
      dataIndex: 'population',
      key: 'population',
      render: (v: number) => formatNumber(v),
    },
    {
      title: 'کد کشور',
      dataIndex: 'countryCode',
      key: 'countryCode',
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_: unknown, record: Country) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(ROUTES.COUNTRY_EDIT.replace(':id', record.id))}
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

  return (
    <div>
      <DataTable<Country>
        columns={columns}
        dataSource={countries}
        loading={loading}
        searchPlaceholder="جستجو بر اساس نام کشور..."
        onSearch={setSearch}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: countries.length,
          onChange: pagination.onChange,
        }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(ROUTES.COUNTRY_CREATE)}
          >
            افزودن کشور
          </Button>
        }
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="حذف کشور"
        content={`آیا از حذف کشور «${deleteTarget ? localized(deleteTarget.name) : ''}» مطمئن هستید؟`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
        danger
      />
    </div>
  );
}

export default CountryList;
