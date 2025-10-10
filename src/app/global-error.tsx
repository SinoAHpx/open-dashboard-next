"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useEffect } from "react";
import { WarningOctagonIcon } from "@phosphor-icons/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardBody className="flex flex-col items-center space-y-6 py-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-danger/10">
                <WarningOctagonIcon className="w-10 h-10 text-danger" weight="fill" />
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-6xl font-bold text-gray-900">500</h1>
                <h2 className="text-2xl font-semibold text-gray-800">Critical Error</h2>
                <p className="text-gray-600">
                  A critical error occurred. Please refresh the page or contact support.
                </p>
                {error.digest && (
                  <p className="text-sm text-gray-500 font-mono">Error ID: {error.digest}</p>
                )}
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  onClick={reset}
                  color="danger"
                  variant="solid"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = "/"}
                  variant="bordered"
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </body>
    </html>
  );
}
