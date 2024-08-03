"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransition } from "react";
import { login, setTokenServer } from "@/service/auth";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

interface IFormInput {
  email: string;
  password: string;
}

export function Login() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const setProfile = useAppStore((state) => state.setProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    startTransition(async () => {
      const res = await login(data);
      await setTokenServer(res.data);
      setProfile(res.data.user);
      router.push("/");
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader className="flex flex-col items-center gap-2">
          <div>LOGO</div>
          <div>Site name</div>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Login ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Login ID"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <CardFooter className="px-0 mt-8">
              <Button disabled={pending} className="w-full" type="submit">
                Login
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
