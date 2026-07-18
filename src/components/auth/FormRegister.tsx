"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

function FormRegister() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [datas, setDatas] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password salah", {
        duration: 4000,
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter", {
        duration: 4000,
      });
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: namaLengkap.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      console.log({ authData });

      if (authError) {
        toast.error(authError.message, {
          duration: 4000,
        });
      } else {
        setDatas(authData.user);
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user?.id,
            full_name: namaLengkap.trim(),
          })
          .select();

        if (profileError) {
          toast.error(profileError.message, {
            duration: 4000,
          });
          return;
        } else {
          toast.success("Periksa Email anda untuk konfirmasi akun baru", {
            duration: 4000,
          });
          router.push("/login");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi kesalahan, silahkan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm py-5">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {/* nama lengkap */}
            <div className="grid gap-2">
              <Label htmlFor="nama_lengkap" className="text-gray-600">
                Nama Lengkap
              </Label>
              <Input
                id="nama_lengkap"
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="rounded-sm px-4 py-5"
                placeholder="masukkan Nama Lengkap anda"
                required
              />
            </div>
            {/* email */}
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
                placeholder="masukkan Email anda"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-gray-600">
                  Password
                </Label>
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="konfirmasi_password" className="text-gray-600">
                  Konfirmasi Password
                </Label>
              </div>
              <Input
                id="konfirmasi_password"
                className="rounded-sm px-4 py-5"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="masukkan konfirmasi password"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full py-5">
              {loading ? (
                <>
                  <Spinner className="size-6" />
                  <span>loading...</span>
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm">
          Sudah punya akun?{" "}
          <Link href={"/login"} className="font-bold text-blue-500">
            Masuk
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default FormRegister;
