import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

export default function RegisterPage() {
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
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            variant="underlined"
          />
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            variant="underlined"
          />
          <Input
            type="password"
            label="Password"
            placeholder="Create a password"
            variant="underlined"
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            variant="underlined"
          />
          <Button color="primary" variant="solid" className="w-full">
            Create Account
          </Button>
        </CardBody>
      </Card>
    </>
  );
}
