import { Tag } from "antd";
import { useTranslation } from '@/locale';

const STATUS_COLORS: Record<string, string> = {
  approved: "green",
  active: "green",
  pending: "orange",
  rejected: "red",
  deleted: "default",
  banned: "red",
  admin: "blue",
  user: "default",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  const normalizedStatus = status.toLowerCase();
  const color = STATUS_COLORS[normalizedStatus] ?? "default";
  const label = t(`status.${normalizedStatus}`);

  return <Tag color={color}>{label}</Tag>;
}
