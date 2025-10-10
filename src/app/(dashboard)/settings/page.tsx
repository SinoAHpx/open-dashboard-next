"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { useAuthStore } from "@/stores/auth";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Profile Settings</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              variant="bordered"
              defaultValue={user?.name || ""}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              variant="bordered"
              defaultValue={user?.email || ""}
            />
            <Button color="primary">Save Changes</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Notifications</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates</p>
              </div>
              <Switch defaultSelected />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive push notifications
                </p>
              </div>
              <Switch />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Security</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              variant="bordered"
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              variant="bordered"
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              variant="bordered"
            />
            <Button color="primary">Update Password</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
