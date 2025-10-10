"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { WrenchIcon } from "@phosphor-icons/react";

export default function ServiceUnavailablePage() {
  return (
    <Card className="w-full max-w-md">
      <CardBody className="flex flex-col items-center space-y-6 py-8">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-warning/10">
          <WrenchIcon className="w-10 h-10 text-warning" weight="fill" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">503</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Service Unavailable</h2>
          <p className="text-gray-600">
            The service is temporarily unavailable due to maintenance. Please check back shortly.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            onClick={() => window.location.reload()}
            color="warning"
            variant="solid"
            className="flex-1"
          >
            Refresh Page
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
