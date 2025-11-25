"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { useRegister } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { registerSchema } from "@/lib/schemas";

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: register, isPending: isLoading } = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const resetFieldErrors = (...keys: (keyof RegisterErrors)[]) => {
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

  const passwordHints = useMemo(() => {
    const requirements: string[] = [];
    if (password.length < 8) {
      requirements.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      requirements.push("Must include at least 1 uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      requirements.push("Must include at least 1 lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      requirements.push("Must include at least 1 number");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      requirements.push("Must include at least 1 special character");
    }
    return requirements;
  }, [password]);

  const passwordStrength = password.length > 0 ? 5 - passwordHints.length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: RegisterErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterErrors;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!agreeToTerms) {
      setErrors({
        general: "You must agree to the Terms of Service and Privacy Policy",
      });
      return;
    }

    try {
      const response = await register({
        email,
        password,
        name,
        redirectTo: "/login",
      });

      if (response?.success === false) {
        setErrors({
          general:
            response.error?.message ||
            "Failed to create account. Please try again.",
        });
        return;
      }

      setSuccessMessage(
        `We just sent a verification link to ${email}. Please verify your email before signing in.`,
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeToTerms(false);
    } catch (error: any) {
      setErrors({
        general: error.message || "Failed to create account. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 justify-center items-center">
        <h1 className="text-4xl font-bold">Create Account</h1>
        <div className="flex space-x-1">
          <p className="text-gray-600">Already have an account?</p>
          <Link href="/login" underline="always">
            Sign in here
          </Link>
          <p>.</p>
        </div>
      </div>
      <Card className="w-full max-w-md">
        <CardBody className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <Alert
                color="danger"
                variant="flat"
                title="Unable to create account"
                description={errors.general}
              />
            )}
            {successMessage && (
              <Alert
                color="success"
                variant="flat"
                title="Account created!"
                description={successMessage}
                endContent={
                  <Button
                    size="sm"
                    variant="flat"
                    color="success"
                    onPress={() => router.push("/login")}
                  >
                    Go to login
                  </Button>
                }
              />
            )}
            <Input
              isRequired
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                resetFieldErrors("name");
              }}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
            <Input
              isRequired
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                resetFieldErrors("email");
              }}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            <div>
              <Input
                isRequired
                type={isPasswordVisible ? "text" : "password"}
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  resetFieldErrors("password");
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
                description={
                  password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, index) => (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded ${
                              index < passwordStrength
                                ? passwordStrength <= 2
                                  ? "bg-red-500"
                                  : passwordStrength === 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Password strength:{" "}
                        {passwordStrength <= 2
                          ? "Weak"
                          : passwordStrength === 3
                            ? "Medium"
                            : "Strong"}
                      </p>
                      {passwordHints.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                          {passwordHints.map((hint) => (
                            <li key={hint}>{hint}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                }
              />
            </div>
            <Input
              isRequired
              type={isConfirmPasswordVisible ? "text" : "password"}
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                resetFieldErrors("confirmPassword");
              }}
              isInvalid={
                confirmPassword.length > 0 && password !== confirmPassword
              }
              errorMessage={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? "Passwords do not match"
                  : errors.confirmPassword
              }
              endContent={
                <Button
                  type="button"
                  size="sm"
                  variant="light"
                  isIconOnly
                  aria-label={
                    isConfirmPasswordVisible
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
                >
                  {isConfirmPasswordVisible ? (
                    <EyeSlash className="h-5 w-5" weight="bold" />
                  ) : (
                    <Eye className="h-5 w-5" weight="bold" />
                  )}
                </Button>
              }
            />
            <Checkbox
              isSelected={agreeToTerms}
              onValueChange={(value) => {
                setAgreeToTerms(value);
                resetFieldErrors("general");
              }}
              size="sm"
              className="mb-2"
            >
              I agree to the{" "}
              <Link href="#" size="sm" className="text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" size="sm" className="text-primary">
                Privacy Policy
              </Link>
            </Checkbox>
            <Button
              type="submit"
              color="primary"
              variant="solid"
              isLoading={isLoading}
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
