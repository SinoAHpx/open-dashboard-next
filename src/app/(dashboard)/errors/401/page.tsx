"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { LockKeyIcon } from "@phosphor-icons/react";

export default function UnauthorizedPage() {
  return (
    <Card className="w-full max-w-md p-4">
      <CardBody className="flex flex-col items-center space-y-6 py-8">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-warning/10">
          <LockKeyIcon className="w-10 h-10 text-warning" weight="fill" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">401</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Unauthorized</h2>
          <p className="text-gray-600">
            You need to sign in to access this resource. Please authenticate to continue.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            as={Link}
            href="/login"
            color="warning"
            variant="solid"
            className="flex-1"
          >
            Sign In
          </Button>
          <Button
            as={Link}
            href="/"
            variant="bordered"
            className="flex-1"
          >
            Go Home
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
