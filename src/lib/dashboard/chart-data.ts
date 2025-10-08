export interface LineChartData {
  name: string;
  revenue: number;
  users: number;
}

export interface BarChartData {
  name: string;
  value: number;
}

export interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export const monthlyRevenueData: LineChartData[] = [
  { name: "Jan", revenue: 4000, users: 240 },
  { name: "Feb", revenue: 3000, users: 198 },
  { name: "Mar", revenue: 5000, users: 380 },
  { name: "Apr", revenue: 4500, users: 308 },
  { name: "May", revenue: 6000, users: 450 },
  { name: "Jun", revenue: 5500, users: 420 },
  { name: "Jul", revenue: 7000, users: 520 },
];

export const categoryData: BarChartData[] = [
  { name: "Product A", value: 4000 },
  { name: "Product B", value: 3000 },
  { name: "Product C", value: 2000 },
  { name: "Product D", value: 2780 },
  { name: "Product E", value: 1890 },
];

export const trafficSourceData: PieChartData[] = [
  { name: "Direct", value: 4000 },
  { name: "Organic", value: 3000 },
  { name: "Referral", value: 2000 },
  { name: "Social", value: 2780 },
  { name: "Email", value: 1890 },
];
