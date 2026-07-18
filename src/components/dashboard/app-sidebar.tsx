"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChartLine,
  LayoutDashboard,
  Plus,
  SquarePen,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export function AppSidebar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Trade journal",
      url: "/dashboard/trades",
      icon: <SquarePen />,
    },
    {
      title: "Add journal",
      url: "/dashboard/add",
      icon: <Plus />,
    },
    {
      title: "Statistic",
      url: "/dashboard/statistics",
      icon: <ChartLine />,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: <User />,
    },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <Sidebar className="bg-blue-600">
      <SidebarHeader>
        <Image
          src={"/screen.png"}
          alt="logo"
          width={200}
          height={100}
          className="mx-auto"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={index} className="px-4 py-2">
                    <SidebarMenuButton
                      isActive={isActive}
                      className={cn(
                        "text-slate-600 transition-colors hover:bg-blue-100 ",
                        isActive &&
                          "bg-blue-100! text-blue-600! font-semibold border-r-2 border-blue-500",
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          onClick={handleLogout}
          className={"w-full bg-blue-600 hover:bg-blue-400"}
        >
          Keluar
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
