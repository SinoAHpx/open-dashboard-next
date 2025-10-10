"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas";
import { useAuthStore } from "@/stores/auth";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    login({ email, name });
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-col space-y-2 justify-center items-center">
        <h1 className="text-4xl font-bold">Create Account</h1>
        <div className="flex space-x-1">
          <p className="text-gray-600">Already have an account?</p>
          <Link href={"/login"} underline="always">
            Sign in here
          </Link>
          <p>.</p>
        </div>
      </div>
      <Card className="w-full max-w-md">
        <CardBody className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              variant="underlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              variant="underlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              variant="underlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              variant="underlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
            />
            <Button
              type="submit"
              color="primary"
              variant="solid"
              className="w-full"
            >
              Create Account
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
