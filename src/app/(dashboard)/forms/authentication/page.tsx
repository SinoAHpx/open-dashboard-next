"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Checkbox,
  Link,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
} from "@heroui/react";

export default function AuthenticationFormsPage() {
  return (
    <div className="w-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Authentication Forms</h1>
        <p className="text-gray-600">
          Essential forms for user authentication including login, registration,
          and password reset flows.
        </p>
      </div>

      <Tabs aria-label="Authentication forms">
        <Tab key="login" title="Login Form">
          <LoginForm />
        </Tab>
        <Tab key="register" title="Registration Form">
          <RegistrationForm />
        </Tab>
        <Tab key="forgot" title="Forgot Password">
          <ForgotPasswordForm />
        </Tab>
        <Tab key="reset" title="Reset Password">
          <ResetPasswordForm />
        </Tab>
      </Tabs>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email && password) {
        console.log("Login submitted:", { email, password, rememberMe });
        setIsLoading(false);
      } else {
        setError("Please fill in all fields");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <Card className="max-w-md mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Sign In</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onValueChange={setEmail}
            errorMessage={error && !email ? "Email is required" : ""}
            isInvalid={error !== "" && !email}
          />
          <Input
            isRequired
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onValueChange={setPassword}
            errorMessage={error && !password ? "Password is required" : ""}
            isInvalid={error !== "" && !password}
          />
          <div className="flex justify-between items-center">
            <Checkbox
              isSelected={rememberMe}
              onValueChange={setRememberMe}
              size="sm"
            >
              Remember me
            </Checkbox>
            <Link href="#" size="sm" className="text-primary">
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Sign In
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="#" size="sm" className="text-primary">
                Sign up
              </Link>
            </p>
          </div>
          <div className="relative my-4">
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
            <Button variant="bordered">Google</Button>
            <Button variant="bordered">GitHub</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function RegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const validationErrors: string[] = [];
    if (!fullName) validationErrors.push("Full name is required");
    if (!email) validationErrors.push("Email is required");
    if (password !== confirmPassword)
      validationErrors.push("Passwords do not match");
    if (!agreeToTerms)
      validationErrors.push("You must agree to the terms of service");
    if (passwordErrors.length > 0) validationErrors.push(...passwordErrors);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      console.log("Registration submitted:", {
        fullName,
        email,
        password,
        agreeToTerms,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="max-w-md mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Create Account</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isRequired
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onValueChange={setFullName}
          />
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onValueChange={setEmail}
          />
          <div>
            <Input
              isRequired
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
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
                  </div>
                )
              }
              isInvalid={password.length > 0 && passwordErrors.length > 0}
              errorMessage={
                password.length > 0 &&
                passwordErrors.length > 0 && (
                  <ul className="list-disc list-inside">
                    {passwordErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
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
            onValueChange={setConfirmPassword}
            isInvalid={
              confirmPassword.length > 0 && password !== confirmPassword
            }
            errorMessage={
              confirmPassword.length > 0 && password !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
          />
          <Checkbox
            isSelected={agreeToTerms}
            onValueChange={setAgreeToTerms}
            size="sm"
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
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <ul className="list-disc list-inside text-sm text-red-600">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Create Account
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="#" size="sm" className="text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function ForgotPasswordForm() {
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
      <Card className="max-w-md mt-4">
        <CardBody className="text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold mb-2">Check your email</h3>
          <p className="text-gray-600 mb-4">
            If an account exists for {email}, you will receive a password reset
            link shortly.
          </p>
          <Button variant="bordered" onPress={() => setSubmitted(false)}>
            Back to form
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Forgot Password</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onValueChange={setEmail}
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
            <Link href="#" size="sm" className="text-primary">
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validatePassword = (pwd: string) => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(pwd)) errors.push("One special character");
    return errors;
  };

  const passwordErrors = password ? validatePassword(password) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordErrors.length > 0 || password !== confirmPassword) return;

    setIsLoading(true);
    setTimeout(() => {
      console.log("Password reset completed");
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <Card className="max-w-md mt-4">
        <CardBody className="text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold mb-2">Password Reset Success</h3>
          <p className="text-gray-600 mb-4">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
          <Button color="primary">Go to Sign In</Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Reset Password</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Please enter your new password below.
          </p>
          <Input
            isRequired
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onValueChange={setPassword}
            isInvalid={password.length > 0 && passwordErrors.length > 0}
            errorMessage={
              password.length > 0 &&
              passwordErrors.length > 0 && (
                <ul className="list-disc list-inside">
                  {passwordErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )
            }
          />
          <Input
            isRequired
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            isInvalid={
              confirmPassword.length > 0 && password !== confirmPassword
            }
            errorMessage={
              confirmPassword.length > 0 && password !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
          />
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            isDisabled={
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              passwordErrors.length > 0
            }
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
