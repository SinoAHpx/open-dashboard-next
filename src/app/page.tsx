"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Total Users</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Revenue</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">$45,678</p>
            <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Active Sessions</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">432</p>
            <p className="text-sm text-gray-500 mt-2">+5% from last hour</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
