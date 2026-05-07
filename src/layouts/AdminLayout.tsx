import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Badge, Button, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  GlobalOutlined,
  BookOutlined,
  TagsOutlined,
  CommentOutlined,
  BarChartOutlined,
  SoundOutlined,
  FieldTimeOutlined,
  ExperimentOutlined,
  SettingOutlined,
  AuditOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '@/auth/useAuth';

const { Header, Sider, Content } = Layout;

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token: themeToken } = theme.useToken();

  // TODO: add pendingComments to backend stats
  const pendingComments = 0;

  const selectedKey = getSelectedKey(location.pathname);

  const menuItems: MenuProps['items'] = [
    { key: '/', icon: <DashboardOutlined />, label: 'داشبورد' },
    { key: '/users', icon: <UserOutlined />, label: 'کاربران' },
    { key: '/countries', icon: <GlobalOutlined />, label: 'کشورها' },
    { key: '/constitutions', icon: <BookOutlined />, label: 'قانون اساسی' },
    { key: '/topics', icon: <TagsOutlined />, label: 'موضوعات' },
    {
      key: '/comments',
      icon: <CommentOutlined />,
      label: (
        <span>
          نظرات
          {pendingComments > 0 && (
            <Badge count={pendingComments} size="small" style={{ marginRight: 8 }} />
          )}
        </span>
      ),
    },
    { key: '/votes', icon: <BarChartOutlined />, label: 'آرا' },
    { key: '/podcasts', icon: <SoundOutlined />, label: 'پادکست‌ها' },
    { key: '/timeline', icon: <FieldTimeOutlined />, label: 'خط زمانی' },
    { key: '/sandboxes', icon: <ExperimentOutlined />, label: 'سندباکس' },
    { type: 'divider' as const },
    { key: '/settings', icon: <SettingOutlined />, label: 'تنظیمات' },
    { key: '/audit', icon: <AuditOutlined />, label: 'لاگ تغییرات' },
  ];

  const userMenuItems: MenuProps['items'] = [
    { key: 'user-info', label: user?.displayName ?? user?.email, disabled: true },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'خروج', danger: true },
  ];

  const onUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        style={{ background: themeToken.colorBgContainer }}
      >
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${themeToken.colorBorderSecondary}` }}>
          <span style={{ fontWeight: 700, fontSize: collapsed ? 14 : 18 }}>
            {collapsed ? 'B' : 'Barabari Admin'}
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderInlineEnd: 'none' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: themeToken.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems, onClick: onUserMenuClick }} placement="bottomLeft">
            <Button type="text" icon={<UserOutlined />}>
              {user?.displayName}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: themeToken.colorBgContainer, borderRadius: themeToken.borderRadiusLG, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

function getSelectedKey(pathname: string): string {
  if (pathname === '/') return '/';
  const segments = pathname.split('/').filter(Boolean);
  return '/' + (segments[0] ?? '');
}
