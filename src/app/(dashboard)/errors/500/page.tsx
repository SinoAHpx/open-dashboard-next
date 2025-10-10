"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { WarningCircleIcon } from "@phosphor-icons/react";

export default function InternalServerErrorPage() {
  return (
    <Card className="w-full max-w-md p-4">
      <CardBody className="flex flex-col items-center space-y-6 py-8">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-danger/10">
          <WarningCircleIcon className="w-10 h-10 text-danger" weight="fill" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">500</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Internal Server Error</h2>
          <p className="text-gray-600">
            An unexpected error occurred on our servers. Please try again later or contact support if the problem persists.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            onClick={() => window.location.reload()}
            color="danger"
            variant="solid"
            className="flex-1"
          >
            Try Again
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
