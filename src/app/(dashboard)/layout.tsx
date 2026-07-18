import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen flex-1 bg-blue-50/30 min-w-0">
        <div className="flex h-14 md:h-16 items-center justify-between border-b px-3 md:px-4">
          <SidebarTrigger />
          <h1 className="font-semibold text-sm md:text-base truncate max-w-[60%] text-right">
            {/* Halo, {user.user_metadata.full_name} */}
            Halo, User
          </h1>
        </div>

        <div className="p-3 md:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
