import { Select, Typography } from "antd";
import type { Topic } from "@/types";
import { localized } from "@/utils/formatters";

const { Text } = Typography;

interface TopicTagSelectProps {
  topics: Topic[];
  value: string[];
  onChange: (ids: string[]) => void;
}

export default function TopicTagSelect({
  topics,
  value,
  onChange,
}: TopicTagSelectProps) {
  const options = topics.map((topic) => ({
    label: localized(topic.name),
    value: topic.id,
  }));

  return (
    <div>
      <Text strong>Topics</Text>
      <Select
        mode="multiple"
        style={{ width: "100%", marginTop: 8 }}
        placeholder="Select topics..."
        value={value}
        onChange={onChange}
        options={options}
        optionFilterProp="label"
      />
    </div>
  );
}
