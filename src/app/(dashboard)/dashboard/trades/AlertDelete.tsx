"use client";

import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteTrade } from "@/actions/trade";

function AlertDelete({
  id,
  refresh,
  setRefresh,
}: {
  id: number;
  refresh: boolean | null;
  setRefresh: (boolean: boolean | null) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTrade(id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefresh(!refresh);
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive">
              <Trash2Icon className="w-4 h-4" />
            </Button>
          }
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default AlertDelete;
