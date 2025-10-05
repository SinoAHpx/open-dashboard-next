"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600">View your analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Page Views</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">45,678</p>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Unique Visitors</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">12,345</p>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Conversion Rate</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">3.2%</p>
            <p className="text-sm text-gray-500 mt-2">+0.4% from last month</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Avg. Session Duration</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">4:32</p>
            <p className="text-sm text-gray-500 mt-2">Minutes</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
