import { Form, Select } from 'antd';
import BilingualInput from './BilingualInput';
import { useTranslation } from '@/locale';

interface ClauseEditorProps {
  namePrefix: (string | number)[];
  topics?: { value: string; label: string }[];
}

export function ClauseEditor({ namePrefix, topics = [] }: ClauseEditorProps) {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item
        name={[...namePrefix, 'text']}
        label={t("constitutions.clause_text")}
        rules={[{ required: true, message: t("topics.topics_required") }]}
      >
        <BilingualInput label="" value={{ fa: '', en: '' }} onChange={() => {}} textarea required />
      </Form.Item>
      <Form.Item name={[...namePrefix, 'topicIds']} label={t("topics.topics_label")}>
        <Select
          mode="multiple"
          placeholder={t("topics.select_topics")}
          options={topics}
          allowClear
        />
      </Form.Item>
    </>
  );
}
