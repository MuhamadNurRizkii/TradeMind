"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { upsertProfile } from "@/actions/profile";
import toast from "react-hot-toast";
import { UserRound, DollarSign, Pencil, Check, X } from "lucide-react";

type Props = {
  initialFullName: string;
  initialBalance: number;
  email: string;
  joinedAt: string;
};

export function ProfileForm({
  initialFullName,
  initialBalance,
  email,
  joinedAt,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState(initialFullName);
  const [balance, setBalance] = useState(String(initialBalance));

  // simpan nilai asli untuk cancel
  const [savedName, setSavedName] = useState(initialFullName);
  const [savedBalance, setSavedBalance] = useState(String(initialBalance));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFullName(savedName);
    setBalance(savedBalance);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await upsertProfile({
        full_name: fullName,
        initial_balance: Number(balance),
      });
      setSavedName(fullName);
      setSavedBalance(balance);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  const avatar = savedName
    ? savedName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="space-y-6">
      {/* Avatar + Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            {/* Avatar circle */}
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">
                {savedName || "—"}
              </h2>
              <p className="text-blue-100 text-sm truncate">{email}</p>
              <p className="text-blue-200 text-xs mt-0.5">
                Bergabung: {joinedAt}
              </p>
            </div>
            {/* Edit / Save / Cancel buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span className="ml-1">Simpan</span>
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20"
                  onClick={handleEdit}
                >
                  <Pencil className="w-4 h-4" />
                  <span className="ml-1">Edit</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Fields */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <h3 className="font-semibold text-slate-700">Informasi Akun</h3>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-500 flex items-center gap-1.5">
              <UserRound className="w-3.5 h-3.5" />
              Nama Lengkap
            </Label>
            {isEditing ? (
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="rounded-lg"
                autoFocus
              />
            ) : (
              <div className="px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 text-sm font-medium">
                {savedName || (
                  <span className="text-slate-400 italic">Belum diisi</span>
                )}
              </div>
            )}
          </div>

          {/* Email — read only */}
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-500 flex items-center gap-1.5">
              <span className="text-xs">✉</span>
              Email
            </Label>
            <div className="px-3 py-2.5 rounded-lg bg-slate-50 text-slate-500 text-sm">
              {email}
              <span className="ml-2 text-xs bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                read-only
              </span>
            </div>
          </div>

          {/* Initial Balance */}
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Modal Awal (Initial Balance)
            </Label>
            {isEditing ? (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  $
                </span>
                <Input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className="rounded-lg pl-7"
                />
              </div>
            ) : (
              <div className="px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 text-sm font-medium">
                {Number(savedBalance) > 0 ? (
                  <span className="font-bold text-blue-600">
                    ${Number(savedBalance).toLocaleString("id-ID", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Belum diisi</span>
                )}
              </div>
            )}
          </div>

          {/* Hint saat editing */}
          {isEditing && (
            <p className="text-xs text-slate-400">
              Klik <strong>Simpan</strong> untuk menyimpan perubahan, atau{" "}
              <strong>✕</strong> untuk membatalkan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
