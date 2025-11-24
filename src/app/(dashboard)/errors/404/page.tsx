"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function NotFoundDemoPage() {
  return (
    <Card className="w-full max-w-md p-4">
      <CardBody className="flex flex-col items-center space-y-6 py-8">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <MagnifyingGlassIcon
            className="w-10 h-10 text-primary"
            weight="bold"
          />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            as={Link}
            href="/"
            color="primary"
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
