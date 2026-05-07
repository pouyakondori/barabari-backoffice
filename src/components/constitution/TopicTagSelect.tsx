import { Select, Typography } from "antd";
import type { Topic } from "@/types";
import { localized } from "@/utils/formatters";
import { useTranslation } from '@/locale';

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
  const { t } = useTranslation();
  const options = topics.map((topic) => ({
    label: localized(topic.name),
    value: topic.id,
  }));

  return (
    <div>
      <Text strong>{t("topics.topics_label")}</Text>
      <Select
        mode="multiple"
        style={{ width: "100%", marginTop: 8 }}
        placeholder={t("topics.select_topics")}
        value={value}
        onChange={onChange}
        options={options}
        optionFilterProp="label"
      />
    </div>
  );
}
