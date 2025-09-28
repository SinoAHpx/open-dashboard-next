import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

export default function LoginPage() {
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
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            variant="underlined"
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            variant="underlined"
            
          />
          <Link className="justify-end text-sm">Forget password? </Link>
          <Button color="primary" variant="solid" className="w-full">
            Sign In
          </Button>
        </CardBody>
      </Card>
    </>
  );
}
