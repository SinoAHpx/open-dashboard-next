import { Link } from "@heroui/link";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="grid grid-cols-[60%_40%] h-screen">
      <div className="relative">
        <Image
          draggable={false}
          src="/bg.jpg"
          fill
          alt="Background"
          className="object-cover"
        />
        <div className="absolute bottom-2 left-2 text-xs text-white bg-opacity-50 px-2 py-1 rounded">
          Image by{" "}
          <Link
            href="https://pixabay.com/users/nils-art-7103936/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9765223"
            underline="always"
            className="text-gray-50"
          >
            Nils
          </Link>{" "}
          from{" "}
          <Link
            href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9765223"
            underline="always"
            className="text-gray-50"
          >
            Pixabay
          </Link>
        </div>
      </div>
      <div className="flex flex-col space-y-6 items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
