import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuth } from '@/auth/useAuth';
import { useTranslation } from '@/locale';

export default function Login() {
  const { t } = useTranslation();
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user && isAdmin) {
    navigate('/', { replace: true });
    return null;
  }

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    const result = await login(values.email, values.password);
    setLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error ?? t("auth.login_error"));
    }
  };

  return (
    <AuthLayout>
      <Card style={{ width: 400, maxWidth: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{t("auth.login_title")}</h2>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            label={t("auth.email")}
            rules={[
              { required: true, message: t("auth.email_required") },
              { type: 'email', message: t("auth.email_invalid") },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder={t("auth.email_placeholder")} size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label={t("auth.password")}
            rules={[{ required: true, message: t("auth.password_required") }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t("auth.password")} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {t("auth.login_btn")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthLayout>
  );
}
