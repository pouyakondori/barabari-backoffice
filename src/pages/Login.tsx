import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuth } from '@/auth/useAuth';

export default function Login() {
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
      setError(result.error ?? 'خطای ورود');
    }
  };

  return (
    <AuthLayout>
      <Card style={{ width: 400, maxWidth: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>ورود به پنل مدیریت</h2>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            label="ایمیل"
            rules={[
              { required: true, message: 'ایمیل الزامی است' },
              { type: 'email', message: 'ایمیل نامعتبر است' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="admin@barabari.com" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="رمز عبور"
            rules={[{ required: true, message: 'رمز عبور الزامی است' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="رمز عبور" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              ورود
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthLayout>
  );
}
