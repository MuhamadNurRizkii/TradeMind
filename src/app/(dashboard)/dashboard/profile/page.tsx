import React from "react";
import { getProfile } from "@/actions/profile";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Toaster } from "react-hot-toast";

async function ProfilePage() {
  const { user, profile } = await getProfile();

  const joinedAt = new Date(user.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="max-w-xl space-y-2">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Profil</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Kelola informasi akun dan modal awal trading Anda
        </p>
      </div>

      <ProfileForm
        initialFullName={profile.full_name ?? ""}
        initialBalance={profile.initial_balance ?? 0}
        email={user.email ?? ""}
        joinedAt={joinedAt}
      />
    </section>
  );
}

export default ProfilePage;
