"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterFormData, registerSchema } from "@/lib/schemas";
import { useRegisterUserMutation } from "@/state/api/authApi";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { setShowPassword, setUser } from "@/state/slice/globalSlice";
import PasswordStrengthMeter from "@/utils/PasswordStrengthMeter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const RegisterPage = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const showPassword = useAppSelector((state) => state.global.showPassword);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // toggle password view
  const handlePasswordToggle = () => {
    dispatch(setShowPassword());
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser(data).unwrap();

      if (response) {
        toast.success("Registration successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        dispatch(setUser(response.data.user));
        form.reset();
        router.push("/");
      } else {
        toast.error("Registration failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome to EduVerse</CardTitle>
        <CardDescription>Create an account to continue</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterSubmit, (err) => {
              console.log("Validation Errors", err);
            })}
            className="space-y-6"
          >
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@mail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password with Eye Icon Toggle */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={handlePasswordToggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordStrengthMeter password={form.watch("password")} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading" : "Register"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link className="text-blue-500 hover:text-blue-700" href={"/login"}>
              Login
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
