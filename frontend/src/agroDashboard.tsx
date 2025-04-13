import {
  Layout,
  Row,
  Col,
  Card,
  InputNumber,
  Button,
  Typography,
  Spin,
  Statistic,
  Divider,
  Space,
  Tag,
} from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  EnvironmentOutlined,
  DashboardOutlined,
  AlertOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { SensorReading } from "./App";
import { AccountInfo } from "@aptos-labs/wallet-adapter-react";

const { Title, Text } = Typography;

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

type props = {
  readings: SensorReading[];
  humidity: number;
  temperature: number;
  moisture: number;
  setHumidity: (value: number) => void;
  setTemperature: (value: number) => void;
  setMoisture: (value: number) => void;
  submitReading: () => void;
  account: AccountInfo | null;
  transactionInProgress: boolean;
};

const AgroDashboard: React.FC<props> = ({
  readings,
  humidity,
  temperature,
  moisture,
  setHumidity,
  setTemperature,
  setMoisture,
  submitReading,
  account,
  transactionInProgress,
}) => {
  // Process data for visualizations
  const processData = () => {
    const recent = readings.slice(0, 10);
    const avgHumidity =
      readings.reduce((a, b) => a + b.humidity, 0) / readings.length;
    const avgTemp =
      readings.reduce((a, b) => a + b.temperature, 0) / readings.length;
    const avgMoisture =
      readings.reduce((a, b) => a + b.moisture, 0) / readings.length;

    const timeDistribution = recent.reduce<Record<number, number>>(
      (acc, reading) => {
        const hour = new Date(parseInt(reading.timestamp) * 1000).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      lineData: recent.map((r) => ({
        ...r,
        time: new Date(parseInt(r.timestamp) * 1000).toLocaleTimeString(),
      })),
      pieData: [
        { name: "Humidity", value: avgHumidity },
        { name: "Temperature", value: avgTemp },
        { name: "Moisture", value: avgMoisture },
      ],
      barData: Object.entries(timeDistribution).map(([hour, count]) => ({
        hour: `${hour}:00`,
        readings: count,
      })),
      radarData: [
        { subject: "Humidity", A: avgHumidity, fullMark: 100 },
        { subject: "Temperature", A: avgTemp, fullMark: 60 },
        { subject: "Moisture", A: avgMoisture, fullMark: 100 },
      ],
      stats: {
        totalReadings: readings.length,
        alerts: readings.filter(
          (r: SensorReading) =>
            r.humidity > 80 || r.temperature > 35 || r.moisture < 20
        ).length,
        latestHumidity: recent[0]?.humidity || 0,
        latestTemp: recent[0]?.temperature || 0,
        latestMoisture: recent[0]?.moisture || 0,
      },
    };
  };

  const { lineData, pieData, barData, radarData, stats } = processData();

  return (
    <Layout
      style={{
        padding: "24px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)",
      }}
    >
      {/* Header Row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(90deg, #2e7d32, #66bb6a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <EnvironmentOutlined style={{ fontSize: 28 }} />
            AgroSense Analytics Dashboard
          </Title>
        </Col>
        <Col>
          <WalletSelector />
        </Col>
      </Row>

      <Spin spinning={transactionInProgress} size="large" tip="Processing...">
        {/* Quick Stats Row */}
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(30, 136, 229, 0.1)",
              }}
            >
              <Statistic
                title="Total Readings"
                value={stats.totalReadings}
                prefix={<DashboardOutlined />}
                valueStyle={{ color: "#1e88e5" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #fff8e1, #ffecb3)",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(255, 160, 0, 0.1)",
              }}
            >
              <Statistic
                title="Alerts"
                value={stats.alerts}
                prefix={<AlertOutlined />}
                valueStyle={{ color: "#ffa000" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.1)",
              }}
            >
              <Statistic
                title="Latest Temp"
                value={stats.latestTemp}
                suffix="°C"
                prefix={
                  stats.latestTemp > 30 ? <RiseOutlined /> : <FallOutlined />
                }
                valueStyle={{
                  color: stats.latestTemp > 30 ? "#e53935" : "#1e88e5",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #f3e5f5, #e1bee7)",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(156, 39, 176, 0.1)",
              }}
            >
              <Statistic
                title="Latest Moisture"
                value={stats.latestMoisture}
                suffix="%"
                prefix={<ThunderboltOutlined />}
                valueStyle={{
                  color: stats.latestMoisture < 30 ? "#e53935" : "#7b1fa2",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Data Input Card */}
        <Card
          title={
            <span style={{ color: "#2e7d32", fontWeight: 600 }}>
              📡 Submit New Sensor Reading
            </span>
          }
          style={{
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.1)",
          }}
          headStyle={{
            borderBottom: "2px solid #66bb6a",
            fontSize: 16,
          }}
        >
          <Row gutter={16}>
            {[
              {
                label: "Humidity (%)",
                value: humidity,
                setter: setHumidity,
                min: 0,
                max: 100,
                color: "#5c6bc0",
              },
              {
                label: "Temperature (°C)",
                value: temperature,
                setter: setTemperature,
                min: -20,
                max: 60,
                color: "#26a69a",
              },
              {
                label: "Soil Moisture (%)",
                value: moisture,
                setter: setMoisture,
                min: 0,
                max: 100,
                color: "#ffa726",
              },
            ].map((field, i) => (
              <Col key={i} xs={24} md={8}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ color: field.color }}>
                    {field.label}
                  </Text>
                </div>
                <InputNumber
                  min={field.min}
                  max={field.max}
                  value={field.value}
                  onChange={(val) => field.setter(val || 0)}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Col>
            ))}
            <Col span={24} style={{ marginTop: 16 }}>
              <Button
                type="primary"
                onClick={submitReading}
                disabled={!account}
                block
                size="large"
                style={{
                  height: 48,
                  background: "linear-gradient(90deg, #2e7d32, #66bb6a)",
                  border: "none",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Submit Sensor Reading
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Main Visualization Row */}
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card
              title={
                <span style={{ color: "#2e7d32", fontWeight: 600 }}>
                  📈 Sensor Trends
                </span>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.1)",
                height: "100%",
              }}
              headStyle={{
                borderBottom: "2px solid #66bb6a",
                fontSize: 16,
              }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="time" tick={{ fill: "#666" }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "#2e7d32",
                      border: "none",
                      borderRadius: 8,
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#5c6bc0"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#26a69a"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="#ffa726"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <span style={{ color: "#2e7d32", fontWeight: 600 }}>
                  🍃 Average Conditions
                </span>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.1)",
                height: "100%",
              }}
              headStyle={{
                borderBottom: "2px solid #66bb6a",
                fontSize: 16,
              }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}`, "Average"]}
                    contentStyle={{
                      background: "#2e7d32",
                      border: "none",
                      borderRadius: 8,
                      color: "white",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Secondary Visualization Row */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card
              title={
                <span style={{ color: "#2e7d32", fontWeight: 600 }}>
                  ⏰ Reading Distribution
                </span>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.1)",
                height: "100%",
              }}
              headStyle={{
                borderBottom: "2px solid #66bb6a",
                fontSize: 16,
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="hour" tick={{ fill: "#666" }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "#2e7d32",
                      border: "none",
                      borderRadius: 8,
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="readings"
                    fill="#66bb6a"
                    radius={[4, 4, 0, 0]}
                    name="Readings per hour"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <span style={{ color: "#2e7d32", fontWeight: 600 }}>
                  📡 Sensor Performance
                </span>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.1)",
                height: "100%",
              }}
              headStyle={{
                borderBottom: "2px solid #66bb6a",
                fontSize: 16,
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Averages"
                    dataKey="A"
                    stroke="#2e7d32"
                    fill="#66bb6a"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#2e7d32",
                      border: "none",
                      borderRadius: 8,
                      color: "white",
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Recent Readings Section */}
        <Card
          title={
            <span style={{ color: "#2e7d32", fontWeight: 600 }}>
              🔄 Recent Sensor Readings
            </span>
          }
          style={{
            marginTop: 24,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.1)",
          }}
          headStyle={{
            borderBottom: "2px solid #66bb6a",
            fontSize: 16,
          }}
        >
          <Row gutter={[16, 16]}>
            {readings
              .slice(0, 6)
              .map((reading: SensorReading, index: Number) => {
                const hasAlert =
                  reading.humidity > 80 ||
                  reading.temperature > 35 ||
                  reading.moisture < 20;
                return (
                  <Col key={String(index)} xs={24} sm={12} md={8}>
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 8,
                        background: hasAlert ? "#fff3e0" : "#f5f5f5",
                        borderLeft: `4px solid ${
                          hasAlert ? "#ff6d00" : "#66bb6a"
                        }`,
                        position: "relative",
                      }}
                    >
                      {hasAlert && (
                        <Tag
                          color="error"
                          style={{ position: "absolute", top: 8, right: 8 }}
                        >
                          Alert
                        </Tag>
                      )}
                      <Space
                        direction="vertical"
                        size={4}
                        style={{ width: "100%" }}
                      >
                        <Statistic
                          title={
                            <span style={{ color: "#5c6bc0" }}>Humidity</span>
                          }
                          value={reading.humidity}
                          suffix="%"
                          valueStyle={{
                            color:
                              reading.humidity > 80 ? "#e53935" : "#5c6bc0",
                            fontSize: 16,
                          }}
                        />
                        <Statistic
                          title={
                            <span style={{ color: "#26a69a" }}>
                              Temperature
                            </span>
                          }
                          value={reading.temperature}
                          suffix="°C"
                          valueStyle={{
                            color:
                              reading.temperature > 35 ? "#e53935" : "#26a69a",
                            fontSize: 16,
                          }}
                        />
                        <Statistic
                          title={
                            <span style={{ color: "#ffa726" }}>Moisture</span>
                          }
                          value={reading.moisture}
                          suffix="%"
                          valueStyle={{
                            color:
                              reading.moisture < 30 ? "#e53935" : "#ffa726",
                            fontSize: 16,
                          }}
                        />
                        <Divider style={{ margin: "8px 0" }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {reading.timestamp}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {reading.address.slice(0, 6)}...
                          {reading.address.slice(-4)}
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Card>
      </Spin>
    </Layout>
  );
};

export default AgroDashboard;
