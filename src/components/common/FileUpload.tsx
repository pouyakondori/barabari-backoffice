import { Typography, Upload } from "antd";
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
  label = "File",
  accept,
}: FileUploadProps) {
  const handleChange = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[info.fileList.length - 1];
    if (file?.originFileObj) {
      onChange(file.name);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong>{label}</Text>
      <div style={{ marginTop: 8 }}>
        {value && (
          <div style={{ marginBottom: 8 }}>
            <Text type="secondary">Current file: {value}</Text>
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
            Click or drag a file to upload
          </p>
        </Dragger>
      </div>
    </div>
  );
}
