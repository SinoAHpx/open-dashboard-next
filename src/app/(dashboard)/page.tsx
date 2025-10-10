"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { useAuthStore } from "@/stores/auth";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  monthlyRevenueData,
  categoryData,
  trafficSourceData,
} from "@/lib/dashboard/chart-data";
import {
  TrendUp,
  TrendDown,
  Users,
  CurrencyDollar,
  Clock,
  ChartLine,
} from "@phosphor-icons/react";
import { useThemeColors } from "@/lib/color-theme";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const themeColors = useThemeColors();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="bordered">Export Report</Button>
          <Button color="primary">Create New</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Users size={24} weight="duotone" />
                </div>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
              <Chip
                size="sm"
                color="success"
                variant="flat"
                startContent={<TrendUp size={14} />}
              >
                12%
              </Chip>
            </div>
            <p className="text-3xl font-bold">1,234</p>
            <Progress value={65} size="sm" color="default" className="mt-2" />
            <p className="text-xs text-gray-400">65% of monthly target</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <CurrencyDollar size={24} weight="duotone" />
                </div>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
              <Chip
                size="sm"
                color="success"
                variant="flat"
                startContent={<TrendUp size={14} />}
              >
                8%
              </Chip>
            </div>
            <p className="text-3xl font-bold">$45,678</p>
            <Progress value={78} size="sm" color="default" className="mt-2" />
            <p className="text-xs text-gray-400">78% of monthly target</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Clock size={24} weight="duotone" />
                </div>
                <p className="text-sm text-gray-500">Active Sessions</p>
              </div>
              <Chip
                size="sm"
                color="success"
                variant="flat"
                startContent={<TrendUp size={14} />}
              >
                5%
              </Chip>
            </div>
            <p className="text-3xl font-bold">432</p>
            <Progress value={43} size="sm" color="default" className="mt-2" />
            <p className="text-xs text-gray-400">Peak: 542 sessions</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <ChartLine size={24} weight="duotone" />
                </div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
              </div>
              <Chip
                size="sm"
                color="danger"
                variant="flat"
                startContent={<TrendDown size={14} />}
              >
                2%
              </Chip>
            </div>
            <p className="text-3xl font-bold">3.24%</p>
            <Progress value={32} size="sm" color="default" className="mt-2" />
            <p className="text-xs text-gray-400">Industry avg: 3.5%</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Revenue & Users Trend</h3>
            <Chip size="sm" variant="flat">
              Last 7 months
            </Chip>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyRevenueData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={themeColors.chartColors.grid}
                />
                <XAxis dataKey="name" stroke={themeColors.chartColors.axis} />
                <YAxis stroke={themeColors.chartColors.axis} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={themeColors.chartColors.primary}
                  strokeWidth={2}
                  dot={{ fill: themeColors.chartColors.primary }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke={themeColors.chartColors.secondary}
                  strokeWidth={2}
                  dot={{ fill: themeColors.chartColors.secondary }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Performance</h3>
            <Chip size="sm" variant="flat">
              Top 5 Products
            </Chip>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={themeColors.chartColors.grid}
                />
                <XAxis dataKey="name" stroke={themeColors.chartColors.axis} />
                <YAxis stroke={themeColors.chartColors.axis} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={themeColors.chartColors.primary}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Traffic Sources</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) =>
                    `${props.name} ${(props.percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {trafficSourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={
                        themeColors.chartPalette[
                          index % themeColors.chartPalette.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </CardHeader>
          <CardBody className="gap-4">
            {[
              {
                user: "John Doe",
                action: "Created new project",
                time: "2 min ago",
              },
              {
                user: "Jane Smith",
                action: "Updated dashboard",
                time: "15 min ago",
              },
              {
                user: "Bob Wilson",
                action: "Added new users",
                time: "1 hour ago",
              },
              {
                user: "Alice Brown",
                action: "Generated report",
                time: "2 hours ago",
              },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 pb-3 border-b last:border-b-0 border-gray-200 dark:border-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardBody className="gap-3">
            <Button fullWidth variant="flat">
              Generate Report
            </Button>
            <Button fullWidth variant="flat">
              Invite Team Member
            </Button>
            <Button fullWidth variant="flat">
              View Analytics
            </Button>
            <Button fullWidth variant="flat">
              Manage Settings
            </Button>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-semibold mb-2">System Status</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">API Status</span>
                  <Chip size="sm" color="success" variant="dot">
                    Operational
                  </Chip>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Database</span>
                  <Chip size="sm" color="success" variant="dot">
                    Healthy
                  </Chip>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Storage</span>
                  <Chip size="sm" color="warning" variant="dot">
                    72% Used
                  </Chip>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
