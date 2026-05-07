import { Input, Tabs } from "antd";
import type { Topic } from "@/types";
import TopicTagSelect from "./TopicTagSelect";
import { useTranslation } from '@/locale';

const { TextArea } = Input;

interface ClauseEditorProps {
  value: { fa: string; en: string };
  onChange: (val: { fa: string; en: string }) => void;
  topics: Topic[];
  selectedTopicIds: string[];
  onTopicChange: (ids: string[]) => void;
}

export default function ClauseEditor({
  value,
  onChange,
  topics,
  selectedTopicIds,
  onTopicChange,
}: ClauseEditorProps) {
  const { t } = useTranslation();
  const tabItems = [
    {
      key: "fa",
      label: t("common.persian"),
      children: (
        <TextArea
          dir="rtl"
          rows={8}
          value={value.fa}
          onChange={(e) => onChange({ ...value, fa: e.target.value })}
          placeholder={t("constitutions.clause_placeholder_fa")}
        />
      ),
    },
    {
      key: "en",
      label: t("common.english"),
      children: (
        <TextArea
          rows={8}
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder={t("constitutions.clause_placeholder_en")}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs items={tabItems} />
      <div style={{ marginTop: 16 }}>
        <TopicTagSelect
          topics={topics}
          value={selectedTopicIds}
          onChange={onTopicChange}
        />
      </div>
    </div>
  );
}
