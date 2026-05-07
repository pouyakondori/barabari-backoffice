import { useState } from 'react';
import {
  Card,
  Descriptions,
  Tabs,
  Button,
  Tag,
  Space,
  Select,
  Avatar,
  Spin,
  Result,
  List,
  Typography,
  message,
} from 'antd';
import {
  UserOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User } from '@/types';
import { ADMIN_USER } from '@/graphql/queries/users';
import { ADMIN_BAN_USER, ADMIN_UNBAN_USER, ADMIN_DELETE_USER, ADMIN_UPDATE_USER } from '@/graphql/mutations/users';
import ConfirmModal from '@/components/common/ConfirmModal';
import { formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { useTranslation } from '@/locale';

const { Title, Text } = Typography;

const activityItems = [
  { title: 'رای موافق به اصل ۱۹', description: '۲ روز پیش' },
  { title: 'نظر در بند ۳ اصل ۲۴', description: '۳ روز پیش' },
  { title: 'رای مخالف به اصل ۲۷', description: '۱ هفته پیش' },
];

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ adminUser: User }>(ADMIN_USER, {
    variables: { id },
    skip: !id,
  });

  const [banUser] = useMutation(ADMIN_BAN_USER);
  const [unbanUser] = useMutation(ADMIN_UNBAN_USER);
  const [deleteUser, { loading: deleteLoading }] = useMutation(ADMIN_DELETE_USER);
  const [updateUser] = useMutation(ADMIN_UPDATE_USER);

  const user = data?.adminUser;

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Result status="error" title={t("users.loading_error")} subTitle={error.message} />;
  if (!user) return <Result status="404" title={t("users.not_found")} />;

  const handleToggleBan = async () => {
    try {
      if (user.isBanned) {
        await unbanUser({ variables: { id: user.id } });
        void message.success(t("users.unbanned"));
      } else {
        await banUser({ variables: { id: user.id } });
        void message.success(t("users.was_banned"));
      }
      await refetch();
    } catch {
      void message.error(t("users.operation_error"));
    }
  };

  const handleRoleChange = async (role: string) => {
    try {
      await updateUser({ variables: { id: user.id, input: { role } } });
      void message.success(t("users.role_changed"));
      await refetch();
    } catch {
      void message.error(t("users.role_change_error"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ variables: { id: user.id } });
      void message.success(t("users.user_deleted"));
      navigate(ROUTES.USERS);
    } catch {
      void message.error(t("users.delete_error"));
    }
  };

  const tabItems = [
    {
      key: 'activity',
      label: t("users.activities"),
      children: (
        <List
          dataSource={activityItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={<Text type="secondary">{item.description}</Text>} />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'actions',
      label: t("users.actions"),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>{t("users.change_role")}</Text>
            <Select
              value={user.role}
              onChange={(v) => void handleRoleChange(v)}
              style={{ width: 200 }}
              options={[
                { value: 'user', label: t("users.user") },
                { value: 'admin', label: t("users.admin") },
              ]}
            />
          </div>
          <Space>
            <Button
              icon={user.isBanned ? <CheckCircleOutlined /> : <StopOutlined />}
              danger={!user.isBanned}
              onClick={() => void handleToggleBan()}
            >
              {user.isBanned ? t("users.unban") : t("users.ban")}
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={() => setDeleteOpen(true)}>
              {t("users.delete_user")}
            </Button>
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowRightOutlined />}
        onClick={() => navigate(ROUTES.USERS)}
        style={{ marginBottom: 16, padding: 0 }}
      >
        {t("users.back_to_list")}
      </Button>

      <Card>
        <Space size="large" align="start">
          <Avatar size={80} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ margin: 0 }}>{user.displayName}</Title>
            <Text type="secondary">{user.email}</Text>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label={t("users.role")}>
            <Tag color={user.role === 'admin' ? 'blue' : 'default'}>{user.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("users.verification_status")}>
            {user.isVerified ? <Tag color="green">{t("users.verified")}</Tag> : <Tag color="orange">{t("users.not_verified")}</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label={t("users.status")}>
            {user.isBanned ? <Tag color="red">{t("users.banned")}</Tag> : <Tag color="green">{t("users.active")}</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label={t("users.join_date")}>
            {formatDate(user.createdAt)}
          </Descriptions.Item>
        </Descriptions>

        <Tabs items={tabItems} style={{ marginTop: 24 }} />
      </Card>

      <ConfirmModal
        open={deleteOpen}
        title={t("users.delete_user")}
        content={`${t("users.delete_confirm_prefix")}${user.displayName}${t("users.delete_confirm_suffix")}`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteOpen(false)}
        loading={deleteLoading}
        danger
      />
    </div>
  );
}

export default UserDetail;
