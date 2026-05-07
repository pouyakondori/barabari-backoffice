import { Card, Skeleton } from "antd";
import { useTranslation } from '@/locale';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UserGrowthData {
  date: string;
  count: number;
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
  loading?: boolean;
}

export default function UserGrowthChart({
  data,
  loading = false,
}: UserGrowthChartProps) {
  const { t } = useTranslation();
  return (
    <Card title={t("charts.user_growth")}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1890ff"
              strokeWidth={2}
              name={t("charts.new_users")}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
