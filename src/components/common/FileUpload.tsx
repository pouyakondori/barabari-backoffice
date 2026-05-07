import { Typography, Upload } from "antd";
import { useTranslation } from '@/locale';
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";

const { Dragger } = Upload;
const { Text } = Typography;

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export default function FileUpload({
  value,
  onChange,
  label,
  accept,
}: FileUploadProps) {
  const { t } = useTranslation();
  const handleChange = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[info.fileList.length - 1];
    if (file?.originFileObj) {
      onChange(file.name);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong>{label ?? t("upload.file_label")}</Text>
      <div style={{ marginTop: 8 }}>
        {value && (
          <div style={{ marginBottom: 8 }}>
            <Text type="secondary">{t("upload.current_file").replace("{value}", value)}</Text>
          </div>
        )}
        <Dragger
          accept={accept}
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleChange}
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            {t("upload.drag_file")}
          </p>
        </Dragger>
      </div>
    </div>
  );
}
