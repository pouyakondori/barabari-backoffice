import { useState } from "react";
import { Image, Typography, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";

const { Dragger } = Upload;
const { Text } = Typography;

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);

  const handleChange = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[info.fileList.length - 1];
    if (file?.originFileObj) {
      const objectUrl = URL.createObjectURL(file.originFileObj);
      setPreviewUrl(objectUrl);
      onChange(file.name);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong>{label}</Text>
      <div style={{ marginTop: 8 }}>
        {previewUrl && (
          <div style={{ marginBottom: 8 }}>
            <Image
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: 200, maxHeight: 200, objectFit: "contain" }}
            />
          </div>
        )}
        <Dragger
          accept="image/*"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleChange}
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag an image to upload
          </p>
        </Dragger>
      </div>
    </div>
  );
}
