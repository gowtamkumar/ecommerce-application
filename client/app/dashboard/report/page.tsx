'use client';
import { getDashboardStats } from '@/lib/apis/report';
import { errorNotification } from '@/lib/utils/notification';
import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined, ShoppingCartOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const { Title } = Typography;

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error: any) {
      errorNotification({ message: error.message || 'Failed to fetch report data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2}>Dashboard Overview</Title>
        <p className="text-gray-500">Real-time update of your business performance</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='borderless' className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              precision={2}
              styles={{ content: { color: "#3f8600" } }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='borderless' className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Profit"
              value={stats.totalProfit}
              precision={2}
              styles={{ content: { color: stats.totalProfit >= 0 ? "#3f8600" : "#cf1322" } }}
              prefix={stats.totalProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='borderless' className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Sales"
              value={stats.totalSales}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='borderless' className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='borderless' className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Low Stock Alert"
              value={stats.lowStockCount}
              styles={{ content: { color: "#cf1322" } }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Sales Trend (Last 7 Days)" variant='borderless' className="shadow-sm">
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Sales ($)" fill="#1677ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
