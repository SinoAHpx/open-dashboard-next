"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/schemas";

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
  emailNotVerified?: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

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

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "1") {
      setInfoMessage("Email verified successfully. You can now sign in.");
    } else {
      setInfoMessage(null);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: "/",
      });
      if (error) {
        const isEmailNotVerified = error.message?.toLowerCase().includes("email") &&
                                   error.message?.toLowerCase().includes("verif");
        setErrors({
          general:
            error.message ||
            "Failed to sign in. Please check your credentials.",
          emailNotVerified: isEmailNotVerified,
        });
        return;
      }
      if (data) {
        router.push("/");
      }
    } catch (error: any) {
      const isEmailNotVerified = error.message?.toLowerCase().includes("email") &&
                                 error.message?.toLowerCase().includes("verif");
      setErrors({
        general:
          error.message || "Failed to sign in. Please check your credentials.",
        emailNotVerified: isEmailNotVerified,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResendingEmail(true);
    setInfoMessage(null);
    setErrors({});

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/login?verified=1",
      });

      setInfoMessage("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to resend verification email" });
    } finally {
      setIsResendingEmail(false);
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
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <div>{errors.general}</div>
                {errors.emailNotVerified && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onClick={handleResendVerification}
                      isLoading={isResendingEmail}
                      className="mt-1"
                    >
                      Resend verification email
                    </Button>
                  </div>
                )}
              </div>
            )}
            {infoMessage && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                {infoMessage}
              </div>
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
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                resetErrors("password");
              }}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
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
