import { Form, Select } from 'antd';
import BilingualInput from './BilingualInput';

interface ClauseEditorProps {
  namePrefix: (string | number)[];
  topics?: { value: string; label: string }[];
}

export function ClauseEditor({ namePrefix, topics = [] }: ClauseEditorProps) {
  return (
    <>
      <Form.Item
        name={[...namePrefix, 'text']}
        label="متن بند"
        rules={[{ required: true, message: 'متن بند الزامی است' }]}
      >
        <BilingualInput label="" value={{ fa: '', en: '' }} onChange={() => {}} textarea required />
      </Form.Item>
      <Form.Item name={[...namePrefix, 'topicIds']} label="موضوعات">
        <Select
          mode="multiple"
          placeholder="موضوعات مرتبط را انتخاب کنید"
          options={topics}
          allowClear
        />
      </Form.Item>
    </>
  );
}
