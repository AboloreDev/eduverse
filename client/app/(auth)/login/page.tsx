import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Log back into your account</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        <Button variant="outline" className="w-full">
          <GithubIcon size={4} />
          Sign in with Github
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 px-6 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input type="email" placeholder="johndoe@example.com" />
          </div>

          <Button>Continue with email</Button>
        </div>

        <Link
          href={"/signup"}
          className="text-blue-500 hover:text-blue-700 flex w-full justify-end"
        >
          Don&apos;t have an account?{" "}
        </Link>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
