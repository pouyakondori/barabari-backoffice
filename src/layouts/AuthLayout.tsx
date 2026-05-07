import type { ReactNode } from 'react';
import { Layout, theme } from 'antd';
import { useTranslation } from '@/locale';

const { Content } = Layout;

export function AuthLayout({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  const { t } = useTranslation();

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <h1 style={{ marginBottom: 32, fontSize: 28, fontWeight: 700 }}>
          {t("app.brand")}
        </h1>
        {children}
      </Content>
    </Layout>
  );
}
