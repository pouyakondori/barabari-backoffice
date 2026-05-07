import type { ReactNode } from "react";
import type { TableProps } from "antd";
import { Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from '@/locale';

interface DataTablePagination {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

interface DataTableProps<T> {
  columns: TableProps<T>["columns"];
  dataSource: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  pagination: DataTablePagination;
  rowKey?: string | ((record: T) => string);
  rowSelection?: TableProps<T>["rowSelection"];
  extra?: ReactNode;
}

export default function DataTable<T extends object>({
  columns,
  dataSource,
  loading = false,
  searchPlaceholder,
  onSearch,
  pagination,
  rowKey = "id",
  rowSelection,
  extra,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  return (
    <div>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <div>
          {onSearch && (
            <Input
              prefix={<SearchOutlined />}
              placeholder={searchPlaceholder ?? t("common.search")}
              onChange={(e) => onSearch(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
          )}
        </div>
        {extra && <div>{extra}</div>}
      </Space>
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        rowSelection={rowSelection}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: pagination.onChange,
          showSizeChanger: true,
          showTotal: (total) => t("common.total_items").replace("{total}", String(total)),
        }}
      />
    </div>
  );
}
