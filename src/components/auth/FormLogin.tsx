"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";

function FormLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log(data);

      if (error) {
        toast.error("username atau password salah!", {
          duration: 4000,
        });
      } else {
        toast.success("Login berhasil");
        router.push("/dashboard");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm py-5">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-600">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-sm px-4 py-5"
                placeholder="masukkan email anda"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-gray-600">
                  Password
                </Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-blue-500 text-sm underline-offset-4 hover:underline"
                >
                  Lupa Password?
                </a>
              </div>
              <Input
                id="password"
                className="rounded-sm px-4 py-5"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="masukkan password anda"
                required
              />
            </div>
            <Button
              disabled={loading}
              type="submit"
              className={`w-full py-5 text-center`}
            >
              {loading ? (
                <>
                  <Spinner className="size-6" />
                  <span>loading...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm">
          Belum punya akun?{" "}
          <Link href={"/register"} className="font-bold text-blue-500">
            Daftar Sekarang
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default FormLogin;
