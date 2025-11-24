"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import {
  Eye,
  EyeSlash,
  GithubLogoIcon,
  GoogleLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useLogin } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema } from "@/lib/schemas";

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const resetErrors = (...keys: (keyof LoginErrors)[]) => {
    setErrors((prev) => {
      if (!prev.general && keys.every((key) => !prev[key])) {
        return prev;
      }
      const next = { ...prev };
      keys.forEach((key) => {
        if (next[key]) {
          delete next[key];
        }
      });
      delete next.general;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await login({
        email,
        password,
        remember: rememberMe,
      });

      if (response?.success === false) {
        setErrors({
          general:
            response.error?.message ||
            "Failed to sign in. Please check your credentials.",
        });
        return;
      }

      const redirectTo = response?.redirectTo ?? "/";
      router.push(redirectTo);
    } catch (error: any) {
      setErrors({
        general:
          error?.message || "Failed to sign in. Please check your credentials.",
      });
    }
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
            {errors.general && (
              <Alert
                color="warning"
                variant="flat"
                title="Unable to sign in"
                description={errors.general}
              />
            )}
            <Input
              isRequired
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetErrors("email");
              }}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            <Input
              isRequired
              type={isPasswordVisible ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                resetErrors("password");
              }}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              endContent={
                <Button
                  type="button"
                  size="sm"
                  variant="light"
                  isIconOnly
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  onPress={() => setIsPasswordVisible((prev) => !prev)}
                >
                  {isPasswordVisible ? (
                    <EyeSlash className="h-5 w-5" weight="bold" />
                  ) : (
                    <Eye className="h-5 w-5" weight="bold" />
                  )}
                </Button>
              }
            />
            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={rememberMe}
                onValueChange={setRememberMe}
                size="sm"
              >
                Remember me
              </Checkbox>
              <Link href="/forgot-password" size="sm" className="text-primary">
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              color="primary"
              variant="solid"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="bordered" startContent={<GoogleLogoIcon />}>
              Google
            </Button>
            <Button variant="bordered" startContent={<GithubLogoIcon />}>
              GitHub
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
