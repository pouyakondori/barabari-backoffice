import { Modal } from "antd";
import { useTranslation } from '@/locale';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okButtonProps={{ danger }}
      okText={danger ? t("common.delete") : t("common.confirm")}
      cancelText={t("common.cancel")}
    >
      <p>{content}</p>
    </Modal>
  );
}
