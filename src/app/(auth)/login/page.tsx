import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="relative">
        <Image
          src="/bg.png"
          fill
          alt="Background"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col space-y-6 items-center justify-center p-8">
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
        </div>
        <Card className="w-full max-w-md">
          {/* <CardHeader className="flex flex-col items-center pb-6">
            
          </CardHeader> */}
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
            <Button color="primary" variant="solid" className="w-full">
              Sign In
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
