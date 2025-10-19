"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Checkbox } from "@heroui/checkbox";
import { Avatar } from "@heroui/avatar";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas";
import { authClient } from "@/lib/auth-client";
import { Camera } from "@phosphor-icons/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validatePassword = (pwd: string) => {
    const validationErrors: string[] = [];
    if (pwd.length < 8) {
      validationErrors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      validationErrors.push("Must include at least 1 uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
      validationErrors.push("Must include at least 1 lowercase letter");
    }
    if (!/[0-9]/.test(pwd)) {
      validationErrors.push("Must include at least 1 number");
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      validationErrors.push("Must include at least 1 special character");
    }
    return validationErrors;
  };

  const passwordErrors = password ? validatePassword(password) : [];
  const passwordStrength =
    password.length > 0 ? 5 - passwordErrors.length : 0;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

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
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setErrors({ general: "You must agree to the Terms of Service and Privacy Policy" });
      setIsLoading(false);
      return;
    }

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });
      router.push("/");
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to create account. Please try again." });
      setIsLoading(false);
    }
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
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {errors.general}
              </div>
            )}
            <div className="flex justify-center">
              <div className="relative">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Avatar
                    src={avatarPreview || undefined}
                    showFallback
                    name={name || undefined}
                    className="w-24 h-24"
                  />
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg">
                    <Camera size={16} weight="fill" className="text-white" />
                  </div>
                </label>
              </div>
            </div>
            <Input
              isRequired
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
            <Input
              isRequired
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            <div>
              <Input
                isRequired
                type="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                description={
                  password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded ${
                              i < passwordStrength
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
                      {passwordErrors.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                          {passwordErrors.map((err, i) => (
                            <li key={i}>{err}</li>
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
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={
                confirmPassword.length > 0 && password !== confirmPassword
              }
              errorMessage={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? "Passwords do not match"
                  : errors.confirmPassword
              }
            />
            <Checkbox
              isSelected={agreeToTerms}
              onValueChange={setAgreeToTerms}
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
