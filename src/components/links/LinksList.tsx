"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Link2, FolderOpen } from "lucide-react";
import { LinkCard } from "./LinkCard";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Link {
  id: string;
  slug: string;
  url: string;
  clicks: number;
  expiresAt: string | null;
  createdAt: string;
}

interface Props {
  refreshTrigger?: number;
}

export function LinksList({ refreshTrigger }: Props) {
  const [deletedLink, setDeletedLink] = useState(null);
  const queryClient = useQueryClient();

  const fetchLinks = async () => {
    try {
      const links = await axios
        .get("/api/links")
        .then(({ data }) => data.links);
      return links;
    } catch (err) {
      alert("error");
    }
  };
  const { data: links, isLoading } = useQuery({
    queryKey: ["link-list"],
    queryFn: () => fetchLinks(),
  });

  const handleDelete = (deletedLink : any) => {
    setDeletedLink(deletedLink);
    queryClient.setQueryData(["link-list"], (prev:Link[]) => {
      return prev?.filter((link) => link.id !== deletedLink.id);
    });
  };

  const handleRestored = (restoredLink:any) => {
    queryClient.setQueryData(["link-list"], (prev:Link[]) => [
      restoredLink,
      ...(prev ?? []),
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (links?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">هنوز لینکی نساخته‌اید</p>
        <p className="text-sm text-slate-400 mt-1">
          اولین لینک کوتاه خود را بسازید
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          لینک‌های شما
        </h2>
        <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {links.length} لینک
        </span>
      </div>

      <div className="space-y-3">
        {links.map((link:Link) => (
          <LinkCard
            key={link?.id}
            link={link}
            onDeleted={handleDelete}
            onRestored={handleRestored}
          />
        ))}
      </div>
    </div>
  );
}
