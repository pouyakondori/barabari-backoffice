import { useMemo } from 'react';
import { Col, Row, Spin, Result, Typography } from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  BarChartOutlined,
  CommentOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import type { PlatformStats } from '@/types';
import { PLATFORM_STATS } from '@/graphql/queries/dashboard';
import StatCard from '@/components/dashboard/StatCard';
import UserGrowthChart from '@/components/dashboard/UserGrowthChart';
import VoteChart from '@/components/dashboard/VoteChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { ROUTES } from '@/utils/constants';

const { Title } = Typography;

function generateMockDays(days: number) {
  const result: { date: string; count: number; agree: number; disagree: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    result.push({
      date: label,
      count: Math.floor(Math.random() * 50) + 10,
      agree: Math.floor(Math.random() * 200) + 50,
      disagree: Math.floor(Math.random() * 100) + 20,
    });
  }
  return result;
}

const pendingItems = [
  { id: '1', primary: 'کاربر ناشناس', secondary: 'این بند باید اصلاح شود...', date: '۲ دقیقه پیش', status: 'pending' },
  { id: '2', primary: 'علی رضایی', secondary: 'موافق نیستم با این تفسیر...', date: '۱۵ دقیقه پیش', status: 'pending' },
  { id: '3', primary: 'مریم احمدی', secondary: 'سوال: آیا این اصل قابل تغییر است؟', date: '۱ ساعت پیش', status: 'pending' },
];

const recentSignups = [
  { id: '1', primary: 'sara@example.com', secondary: 'سارا محمدی', date: '۵ دقیقه پیش' },
  { id: '2', primary: 'ali@example.com', secondary: 'علی کریمی', date: '۳۰ دقیقه پیش' },
  { id: '3', primary: 'reza@example.com', secondary: 'رضا حسینی', date: '۲ ساعت پیش' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<{ platformStats: PlatformStats }>(PLATFORM_STATS);

  const mockData = useMemo(() => generateMockDays(7), []);
  const stats = data?.platformStats;

  if (error) {
    return <Result status="error" title="خطا در بارگذاری داشبورد" subTitle={error.message} />;
  }

  return (
    <div>
      <Title level={3}>داشبورد</Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="کاربران"
              value={stats?.totalUsers ?? 0}
              icon={<UserOutlined />}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="کشورها"
              value={stats?.totalCountries ?? 0}
              icon={<GlobalOutlined />}
              color="#52c41a"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="آرا"
              value={stats?.totalVotes ?? 0}
              icon={<BarChartOutlined />}
              color="#722ed1"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="نظرات"
              value={stats?.totalComments ?? 0}
              icon={<CommentOutlined />}
              color="#13c2c2"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="نظرات در انتظار"
              value={stats?.pendingComments ?? 0}
              icon={<WarningOutlined />}
              color="#fa541c"
              loading={loading}
            />
          </Col>
        </Row>
      </Spin>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <UserGrowthChart data={mockData.map(({ date, count }) => ({ date, count }))} />
        </Col>
        <Col xs={24} lg={12}>
          <VoteChart data={mockData.map(({ date, agree, disagree }) => ({ date, agree, disagree }))} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <RecentActivity
            title="نظرات در انتظار تایید"
            items={pendingItems}
            onItemClick={() => navigate(ROUTES.COMMENTS)}
          />
        </Col>
        <Col xs={24} lg={12}>
          <RecentActivity
            title="ثبت‌نام‌های اخیر"
            items={recentSignups}
            onItemClick={(id) => navigate(ROUTES.USER_DETAIL.replace(':id', id))}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
