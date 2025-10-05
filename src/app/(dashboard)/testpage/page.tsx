"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function TestPagePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">TestPage</h1>
        <p className="text-gray-600">Manage and view your testpage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sample Card 1</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-gray-500 mt-2">Sample metric</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sample Card 2</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">5,678</p>
            <p className="text-sm text-gray-500 mt-2">Another metric</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sample Card 3</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">9,012</p>
            <p className="text-sm text-gray-500 mt-2">Third metric</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
