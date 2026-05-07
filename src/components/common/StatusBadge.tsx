import { Tag } from "antd";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  approved: { color: "green", label: "Approved" },
  active: { color: "green", label: "Active" },
  pending: { color: "orange", label: "Pending" },
  rejected: { color: "red", label: "Rejected" },
  deleted: { color: "default", label: "Deleted" },
  banned: { color: "red", label: "Banned" },
  admin: { color: "blue", label: "Admin" },
  user: { color: "default", label: "User" },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status.toLowerCase()] ?? {
    color: "default",
    label: status,
  };

  return <Tag color={config.color}>{config.label}</Tag>;
}
