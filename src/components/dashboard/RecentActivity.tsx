import { Card, List, Typography } from "antd";
import StatusBadge from "@/components/common/StatusBadge";

const { Text } = Typography;

interface ActivityItem {
  id: string;
  primary: string;
  secondary: string;
  date: string;
  status?: string;
}

interface RecentActivityProps {
  title: string;
  items: ActivityItem[];
  loading?: boolean;
  onItemClick?: (id: string) => void;
}

export default function RecentActivity({
  title,
  items,
  loading = false,
  onItemClick,
}: RecentActivityProps) {
  return (
    <Card title={title}>
      <List
        loading={loading}
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: onItemClick ? "pointer" : "default" }}
            onClick={() => onItemClick?.(item.id)}
            extra={item.status ? <StatusBadge status={item.status} /> : null}
          >
            <List.Item.Meta
              title={item.primary}
              description={
                <>
                  <Text type="secondary">{item.secondary}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.date}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
