import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

type FilterProps = {
  search: string;
  setSearch: (value: string) => void;
  position: string | null;
  setPosition: (value: string | null) => void;
  status: string | null;
  setStatus: (value: string | null) => void;
  period: string | null;
  setPeriod: (value: string | null) => void;
};

function FilterBar({
  search,
  setSearch,
  position,
  setPosition,
  status,
  setStatus,
  period,
  setPeriod,
}: FilterProps) {
  return (
    <div className="p-3 md:p-4 flex flex-col md:flex-row gap-3 border rounded-sm">
      {/* search */}
      <div className="flex flex-col gap-1 md:w-1/3">
        <Label className="text-gray-600">Cari Asset</Label>
        <Input
          className="rounded-sm"
          placeholder="Cari Asset"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* filters */}
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-1 md:gap-2">
        {/* posisi */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600 mb-1">Posisi</Label>
          <Select
            defaultValue={"all"}
            value={position}
            onValueChange={(value) => setPosition(value)}
          >
            <SelectTrigger className="h-10 w-full rounded-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">
                  <div className="flex items-center gap-2">
                    <span>Semua</span>
                  </div>
                </SelectItem>

                <SelectItem value="Long">
                  <div className="flex items-center gap-2">
                    <span>Long</span>
                  </div>
                </SelectItem>

                <SelectItem value="Short">
                  <div className="flex items-center gap-2">
                    <span>Short</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* status */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600 mb-1">Status</Label>
          <Select
            defaultValue={"All"}
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger className="h-10 w-full rounded-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">
                  <div className="flex items-center gap-2">
                    <span>Semua</span>
                  </div>
                </SelectItem>

                <SelectItem value="Win">
                  <div className="flex items-center gap-2">
                    <span>Win</span>
                  </div>
                </SelectItem>

                <SelectItem value="Lose">
                  <div className="flex items-center gap-2">
                    <span>Lose</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* date */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600 mb-1">Periode</Label>
          <Select
            defaultValue={"all"}
            value={period}
            onValueChange={(value) => setPeriod(value)}
          >
            <SelectTrigger className="h-10 w-full rounded-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">
                  <div className="flex items-center gap-2">
                    <span>Semua</span>
                  </div>
                </SelectItem>

                <SelectItem value="7">
                  <div className="flex items-center gap-2">
                    <span>7 Hari</span>
                  </div>
                </SelectItem>

                <SelectItem value="30">
                  <div className="flex items-center gap-2">
                    <span>30 Hari</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
