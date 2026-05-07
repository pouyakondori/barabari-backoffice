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

const { Title, Text } = Typography;

const activityItems = [
  { title: 'رای موافق به اصل ۱۹', description: '۲ روز پیش' },
  { title: 'نظر در بند ۳ اصل ۲۴', description: '۳ روز پیش' },
  { title: 'رای مخالف به اصل ۲۷', description: '۱ هفته پیش' },
];

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  if (error) return <Result status="error" title="خطا در بارگذاری کاربر" subTitle={error.message} />;
  if (!user) return <Result status="404" title="کاربر یافت نشد" />;

  const handleToggleBan = async () => {
    try {
      if (user.isBanned) {
        await unbanUser({ variables: { id: user.id } });
        void message.success('رفع مسدودی شد');
      } else {
        await banUser({ variables: { id: user.id } });
        void message.success('کاربر مسدود شد');
      }
      await refetch();
    } catch {
      void message.error('خطا در انجام عملیات');
    }
  };

  const handleRoleChange = async (role: string) => {
    try {
      await updateUser({ variables: { id: user.id, input: { role } } });
      void message.success('نقش کاربر تغییر کرد');
      await refetch();
    } catch {
      void message.error('خطا در تغییر نقش');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ variables: { id: user.id } });
      void message.success('کاربر حذف شد');
      navigate(ROUTES.USERS);
    } catch {
      void message.error('خطا در حذف کاربر');
    }
  };

  const tabItems = [
    {
      key: 'activity',
      label: 'فعالیت‌ها',
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
      label: 'عملیات',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>تغییر نقش</Text>
            <Select
              value={user.role}
              onChange={(v) => void handleRoleChange(v)}
              style={{ width: 200 }}
              options={[
                { value: 'user', label: 'کاربر' },
                { value: 'admin', label: 'ادمین' },
              ]}
            />
          </div>
          <Space>
            <Button
              icon={user.isBanned ? <CheckCircleOutlined /> : <StopOutlined />}
              danger={!user.isBanned}
              onClick={() => void handleToggleBan()}
            >
              {user.isBanned ? 'رفع مسدودی' : 'مسدود کردن'}
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={() => setDeleteOpen(true)}>
              حذف کاربر
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
        بازگشت به لیست کاربران
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
          <Descriptions.Item label="نقش">
            <Tag color={user.role === 'admin' ? 'blue' : 'default'}>{user.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="وضعیت تایید">
            {user.isVerified ? <Tag color="green">تایید شده</Tag> : <Tag color="orange">تایید نشده</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="وضعیت">
            {user.isBanned ? <Tag color="red">مسدود</Tag> : <Tag color="green">فعال</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="تاریخ عضویت">
            {formatDate(user.createdAt)}
          </Descriptions.Item>
        </Descriptions>

        <Tabs items={tabItems} style={{ marginTop: 24 }} />
      </Card>

      <ConfirmModal
        open={deleteOpen}
        title="حذف کاربر"
        content={`آیا از حذف کاربر «${user.displayName}» مطمئن هستید؟ این عمل غیرقابل بازگشت است.`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteOpen(false)}
        loading={deleteLoading}
        danger
      />
    </div>
  );
}

export default UserDetail;
