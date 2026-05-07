import { Col, Input, Row, Typography } from "antd";
import { useTranslation } from '@/locale';

const { TextArea } = Input;
const { Text } = Typography;

interface BilingualInputProps {
  label: string;
  value: { fa: string; en: string };
  onChange: (val: { fa: string; en: string }) => void;
  textarea?: boolean;
  required?: boolean;
  rows?: number;
}

export default function BilingualInput({
  label,
  value,
  onChange,
  textarea = false,
  required = false,
  rows = 4,
}: BilingualInputProps) {
  const { t } = useTranslation();
  const InputComponent = textarea ? TextArea : Input;

  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </Text>
      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <Text type="secondary">{t("common.persian")}</Text>
          <InputComponent
            dir="rtl"
            value={value.fa}
            onChange={(e) => onChange({ ...value, fa: e.target.value })}
            {...(textarea ? { rows } : {})}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary">{t("common.english")}</Text>
          <InputComponent
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            {...(textarea ? { rows } : {})}
          />
        </Col>
      </Row>
    </div>
  );
}
