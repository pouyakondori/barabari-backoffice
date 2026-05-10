import { useState } from "react";
import { Typography, Upload, message, Progress } from "antd";
import { useTranslation } from '@/locale';
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { Dragger } = Upload;
const { Text } = Typography;

const BACKEND_URL = import.meta.env.VITE_REST_URL || "http://localhost:4001";

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
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadProps: UploadProps = {
    accept,
    showUploadList: false,
    maxCount: 1,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file as Blob);

      try {
        const token = localStorage.getItem("accessToken");
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${BACKEND_URL}/admin/podcasts/upload`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          setUploading(false);
          if (xhr.status === 200) {
            const resp = JSON.parse(xhr.responseText);
            onChange(resp.url);
            message.success(t("upload.upload_success"));
            onSuccess?.(resp);
          } else {
            message.error(t("upload.upload_failed"));
            onError?.(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          setUploading(false);
          message.error(t("upload.upload_failed"));
          onError?.(new Error("Upload failed"));
        };

        xhr.send(formData);
      } catch (err: any) {
        setUploading(false);
        message.error(err.message || t("upload.upload_failed"));
        onError?.(err);
      }
    },
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
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            {uploading ? t("upload.uploading") : t("upload.drag_file")}
          </p>
        </Dragger>
        {uploading && <Progress percent={progress} size="small" style={{ marginTop: 8 }} />}
      </div>
    </div>
  );
}
