import { useMemo, useState } from 'react';
import {
  Card,
  Col,
  DatePicker,
  Progress,
  Row,
  Select,
  Statistic,
  Table,
  Typography,
} from 'antd';
import {
  LikeOutlined,
  DislikeOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface VoteOverTime {
  date: string;
  agree: number;
  disagree: number;
}

interface TopClause {
  id: string;
  text: string;
  country: string;
  agree: number;
  disagree: number;
  total: number;
}

// Mock data — replace with real query when adminVoteStats is available
const MOCK_VOTES_OVER_TIME: VoteOverTime[] = [
  { date: '2024-01', agree: 320, disagree: 180 },
  { date: '2024-02', agree: 450, disagree: 220 },
  { date: '2024-03', agree: 380, disagree: 190 },
  { date: '2024-04', agree: 520, disagree: 310 },
  { date: '2024-05', agree: 610, disagree: 280 },
  { date: '2024-06', agree: 490, disagree: 350 },
];

const MOCK_TOP_CLAUSES: TopClause[] = [
  { id: '1', text: 'حق آزادی بیان برای تمامی شهروندان تضمین می‌شود...', country: 'Iran', agree: 1250, disagree: 340, total: 1590 },
  { id: '2', text: 'هر شهروند حق دسترسی به آموزش رایگان را دارد...', country: 'Turkey', agree: 980, disagree: 420, total: 1400 },
  { id: '3', text: 'قوه قضاییه مستقل و غیرقابل نفوذ است...', country: 'Egypt', agree: 870, disagree: 560, total: 1430 },
  { id: '4', text: 'حق مالکیت خصوصی محترم شمرده می‌شود...', country: 'Iran', agree: 760, disagree: 380, total: 1140 },
  { id: '5', text: 'آزادی اجتماعات و تشکل‌های مدنی...', country: 'Iraq', agree: 650, disagree: 290, total: 940 },
];

const MOCK_TOTAL = { agree: 4980, disagree: 2340, total: 7320 };

const PIE_COLORS = ['#52c41a', '#ff4d4f'];

const COUNTRY_OPTIONS = [
  { label: 'All Countries', value: '' },
  { label: 'Iran', value: 'iran' },
  { label: 'Turkey', value: 'turkey' },
  { label: 'Egypt', value: 'egypt' },
  { label: 'Iraq', value: 'iraq' },
];

export default function VoteAnalytics() {
  const [_dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [_country, setCountry] = useState('');

  const agreePercent = Math.round((MOCK_TOTAL.agree / MOCK_TOTAL.total) * 100);

  const pieData = useMemo(
    () => [
      { name: 'Agree', value: MOCK_TOTAL.agree },
      { name: 'Disagree', value: MOCK_TOTAL.disagree },
    ],
    [],
  );

  const clauseColumns: ColumnsType<TopClause> = [
    {
      title: 'Clause Text',
      dataIndex: 'text',
      ellipsis: true,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      width: 100,
    },
    {
      title: 'Agree',
      dataIndex: 'agree',
      width: 80,
      sorter: (a, b) => a.agree - b.agree,
      render: (val: number) => <span style={{ color: '#52c41a' }}>{val}</span>,
    },
    {
      title: 'Disagree',
      dataIndex: 'disagree',
      width: 90,
      sorter: (a, b) => a.disagree - b.disagree,
      render: (val: number) => <span style={{ color: '#ff4d4f' }}>{val}</span>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width: 80,
      sorter: (a, b) => a.total - b.total,
      defaultSortOrder: 'descend',
    },
  ];

  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
          <Col>
            <Select
              style={{ width: 200 }}
              placeholder="Filter by country"
              options={COUNTRY_OPTIONS}
              onChange={setCountry}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Overview stats */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Votes"
              value={MOCK_TOTAL.total}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Agree Votes"
              value={MOCK_TOTAL.agree}
              prefix={<LikeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Disagree Votes"
              value={MOCK_TOTAL.disagree}
              prefix={<DislikeOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Votes Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_VOTES_OVER_TIME}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="agree" fill="#52c41a" name="Agree" />
                <Bar dataKey="disagree" fill="#ff4d4f" name="Disagree" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Agree / Disagree Ratio">
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Progress
                type="circle"
                percent={agreePercent}
                format={() => `${agreePercent}%`}
                strokeColor="#52c41a"
              />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={(props: any) =>
                    `${props.name || ''} ${((props.percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top clauses table */}
      <Card title={<Title level={5} style={{ margin: 0 }}>Top Clauses by Vote Count</Title>}>
        <Table<TopClause>
          columns={clauseColumns}
          dataSource={MOCK_TOP_CLAUSES}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
