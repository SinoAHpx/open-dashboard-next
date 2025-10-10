"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { ProhibitIcon } from "@phosphor-icons/react";

export default function ForbiddenPage() {
  return (
    <Card className="w-full max-w-md p-4">
      <CardBody className="flex flex-col items-center space-y-6 py-8">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-danger/10">
          <ProhibitIcon className="w-10 h-10 text-danger" weight="fill" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">403</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Access Forbidden</h2>
          <p className="text-gray-600">
            You do not have permission to access this resource. Contact your administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            as={Link}
            href="/"
            color="danger"
            variant="solid"
            className="flex-1"
          >
            Go Home
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="bordered"
            className="flex-1"
          >
            Go Back
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
