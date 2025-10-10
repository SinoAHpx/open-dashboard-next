"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log("Password reset requested for:", email);
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <>
        <div className="flex flex-col space-y-2 justify-center items-center">
          <h1 className="text-4xl font-bold">Check your email</h1>
        </div>
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">Email sent</h3>
            <p className="text-gray-600 mb-4">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
            <Button variant="bordered" onPress={() => setSubmitted(false)}>
              Back to form
            </Button>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-2 justify-center items-center">
        <h1 className="text-4xl font-bold">Forgot Password</h1>
        <div className="flex space-x-1">
          <p className="text-gray-600">Remember your password?</p>
          <Link href={"/login"} underline="always">
            Sign in here
          </Link>
          <p>.</p>
        </div>
      </div>
      <Card className="w-full max-w-md">
        <CardBody className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email address and we will send you a link to reset
              your password.
            </p>
            <Input
              isRequired
              type="email"
              label="Email"
              placeholder="Enter your email"
              variant="underlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Send Reset Link
            </Button>
            <div className="text-center">
              <Link href="/login" size="sm" className="text-primary">
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
