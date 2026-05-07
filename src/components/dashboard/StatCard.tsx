import type { ReactNode } from "react";
import { Card, Skeleton, Statistic } from "antd";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
  suffix?: string;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "#1890ff",
  suffix,
  loading = false,
}: StatCardProps) {
  return (
    <Card>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <Statistic
          title={title}
          value={value}
          suffix={suffix}
          prefix={
            <span style={{ color, fontSize: 24, marginRight: 8 }}>
              {icon}
            </span>
          }
        />
      )}
    </Card>
  );
}
