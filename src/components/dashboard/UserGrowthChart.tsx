import { Card, Skeleton } from "antd";
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
  return (
    <Card title="User Growth">
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
              name="New Users"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
