import { Card, Skeleton } from "antd";
import { useTranslation } from '@/locale';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface VoteChartData {
  date: string;
  agree: number;
  disagree: number;
}

interface VoteChartProps {
  data: VoteChartData[];
  loading?: boolean;
}

export default function VoteChart({ data, loading = false }: VoteChartProps) {
  const { t } = useTranslation();
  return (
    <Card title={t("charts.vote_activity")}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="agree" fill="#52c41a" name={t("votes.agree")} />
            <Bar dataKey="disagree" fill="#ff4d4f" name={t("votes.disagree")} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
