"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/schemas";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    login({ email });
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-col space-y-2 justify-center items-center">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <div className="flex space-x-1">
          <p className="text-gray-600">Sign in to your account, or</p>
          <Link href={"/register"} underline="always">
            sign up here
          </Link>
          <p>.</p>
        </div>
      </div>
      <Card className="w-full max-w-md">
        <CardBody className="space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
              placeholder="Enter your password"
              variant="underlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
            />
            <Link className="justify-end text-sm">Forget password? </Link>
            <Button type="submit" color="primary" variant="solid" className="w-full">
              Sign In
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
