"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EmptyImage from "@/components/icons/EmptyImage";

export default function Upload({ user }: { user: User }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const supabase = createClient();
  const { refresh } = useRouter();

  const handleUpload = async (file: File) => {
    setIsDropdownOpen(false);
    const uploadedFile = `portfilio${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("portfolios")
      .upload(uploadedFile, file);
    const { error: insertError } = await supabase
      .from("portfolio_pictures")
      .insert([{ user_id: user.id, picture_url: uploadedFile }]);
    refresh();
  };

  return (
    <>
      <div className="relative aspect-square w-full h-full bg-slate-300 rounded-md flex justify-center items-center group">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild className="z-20">
            <MoreHorizontal className="text-black absolute top-4 right-4 hover:cursor-pointer bg-white rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute right-[-12px]">
            <Label
              htmlFor="upload"
              className="bg-secondary rounded-full block p-3 text-center cursor-pointer"
            >
              Upload
            </Label>
            <Input
              id="upload"
              type="file"
              onChange={async (e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  await handleUpload(file);
                }
              }}
              className="rounded-md w-full hidden"
            />
          </DropdownMenuContent>
        </DropdownMenu>
        <EmptyImage />
      </div>
    </>
  );
}
