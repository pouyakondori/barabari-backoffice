import { useMemo } from 'react';
import { Button, Space, Tag, Spin, Result, Typography } from 'antd';
import { EyeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { Constitution } from '@/types';
import { GET_CONSTITUTIONS } from '@/graphql/queries/constitutions';
import DataTable from '@/components/common/DataTable';
import { usePagination } from '@/hooks/usePagination';
import { localized } from '@/utils/formatters';

const { Title } = Typography;

interface ConstitutionRow {
  id: string;
  countryName: string;
  countrySlug: string;
  chapterCount: number;
  articleCount: number;
  clauseCount: number;
  pdfUrl?: string;
}

export function ConstitutionList() {
  const navigate = useNavigate();
  const pagination = usePagination();

  const { data, loading, error } = useQuery<{ constitutions: Constitution[] }>(GET_CONSTITUTIONS);

  const rows: ConstitutionRow[] = useMemo(() => {
    if (!data?.constitutions) return [];
    return data.constitutions.map((c) => {
      let articleCount = 0;
      let clauseCount = 0;
      for (const ch of c.chapters) {
        articleCount += ch.articles.length;
        for (const art of ch.articles) {
          clauseCount += art.clauses.length;
        }
      }
      return {
        id: c.id,
        countryName: localized(c.country.name),
        countrySlug: c.country.slug,
        chapterCount: c.chapters.length,
        articleCount,
        clauseCount,
        pdfUrl: c.pdfUrl,
      };
    });
  }, [data]);

  const columns: ColumnsType<ConstitutionRow> = useMemo(() => [
    {
      title: 'کشور',
      dataIndex: 'countryName',
      key: 'countryName',
    },
    {
      title: 'تعداد فصول',
      dataIndex: 'chapterCount',
      key: 'chapterCount',
    },
    {
      title: 'تعداد اصول',
      dataIndex: 'articleCount',
      key: 'articleCount',
    },
    {
      title: 'تعداد بندها',
      dataIndex: 'clauseCount',
      key: 'clauseCount',
    },
    {
      title: 'PDF',
      key: 'pdfUrl',
      render: (_: unknown, record: ConstitutionRow) =>
        record.pdfUrl ? (
          <a href={record.pdfUrl} target="_blank" rel="noopener noreferrer">
            <Tag color="blue">دانلود</Tag>
          </a>
        ) : (
          <Tag color="default">ندارد</Tag>
        ),
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_: unknown, record: ConstitutionRow) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/constitutions/${record.countrySlug}`)}
          />
          <Button type="link" size="small" icon={<UploadOutlined />} disabled>
            آپلود PDF
          </Button>
        </Space>
      ),
    },
  ], [navigate]);

  if (error) return <Result status="error" title="خطا در بارگذاری" subTitle={error.message} />;

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>قوانین اساسی</Title>
        <Button type="primary" icon={<PlusOutlined />} disabled>
          افزودن قانون اساسی
        </Button>
      </Space>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      ) : (
        <DataTable<ConstitutionRow>
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: rows.length,
            onChange: pagination.onChange,
          }}
        />
      )}
    </div>
  );
}

export default ConstitutionList;
