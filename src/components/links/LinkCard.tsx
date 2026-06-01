"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import {
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MousePointer,
  Clock,
  RotateCcw,
  Eye,
} from "lucide-react";
import { getShortUrl, formatDate, isExpired } from "@/lib/utils";

import { http } from "../../httpServices";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Link {
  id: string;
  slug: string;
  url: string;
  clicks: number;
  expiresAt: string | null;
  createdAt: string;
}

interface Props {
  link: Link;
  onDeleted: (link: Link) => void;
  onRestored: (link: Link) => void;
}

interface undoProps {
  handleUndo: (id: string) => void;
  progressIntervalRef: RefObject<HTMLInputElement | null>;
  undoTimerRef: RefObject<HTMLInputElement | null>;
  queryClient: QueryClient;
}

export function LinkCard({ link, onDeleted, onRestored }: Props) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const queryClient = useQueryClient();
  const expired = isExpired(link.expiresAt ? new Date(link.expiresAt) : null);
  const shortUrl = getShortUrl(link.slug);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    onDeleted(link);
    setIsDeleting(true);

    const toastProps = {
      handleUndo,
      link,
      progressIntervalRef,
      undoTimerRef,
      queryClient,
    };

    try {
      const res = await http.delete(`/api/links/${link.id}`);
      setShowUndo(true);
      toast.custom(
        () => {
          return <Undo {...toastProps} />;
        },
        { duration: 5000 },
      );
    } catch {
      setIsDeleting(false);
    }
  };

  const handleUndo = async () => {
    clearTimeout(undoTimerRef.current!);
    clearInterval(progressIntervalRef.current!);
    onRestored(link);
    toast.dismiss();
    setIsDeleting(false);
    try {
      await http
        .patch(`/api/links/${link.id}`)
        .then(() => queryClient.invalidateQueries({ queryKey: ["link-list"] }));
    } catch {
      toast.error("خطایی رخ داده است");
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(undoTimerRef.current!);
      clearInterval(progressIntervalRef.current!);
    };
  }, []);

  return (
    <div
      className={`card p-4 transition-all duration-200 ${expired ? "opacity-60" : "hover:shadow-md"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Short URL */}
          <div className="flex items-center gap-2 mb-1">
            <a
              href={`/${link.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sky-600 font-medium text-sm hover:underline truncate"
              dir="ltr"
            >
              {shortUrl}
            </a>
            {expired && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex-shrink-0">
                منقضی
              </span>
            )}
          </div>

          {/* Original URL */}
          <p className="text-xs text-slate-400 truncate" dir="ltr">
            {link.url}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-x-1">
              <Eye size={12} />
              <span className="text-xs text-slate-500">{link.clicks}</span>
            </div>
            {link.expiresAt && (
              <span
                className={`flex items-center gap-1 text-xs ${expired ? "text-red-500" : "text-slate-500"}`}
              >
                انقضا: {formatDate(link.expiresAt)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const Undo = ({
  handleUndo,
  progressIntervalRef,
  undoTimerRef,
  queryClient,
}: undoProps) => {
  const [undoProgress, setUndoProgress] = useState(100);
  useEffect(() => {
    const start = Date.now();
    const duration = 5000;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);

      setUndoProgress(remaining);
    }, 20);

    undoTimerRef.current = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["link-list"],
      });

      clearInterval(progressIntervalRef.current!);
    }, duration);

    return () => {
      clearInterval(progressIntervalRef.current!);
      clearTimeout(undoTimerRef.current!);
    };
  }, []);

  return (
    <div className="min-w-[300px] card p-4 border-amber-200 bg-amber-50 animate-slide-in">
      <div className="flex items-center justify-between ">
        <button
          onClick={handleUndo}
          className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          بازگردانی
        </button>
      </div>
      <div className="mt-3 h-1 bg-amber-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-none"
          style={{ width: `${undoProgress}%` }}
        />
      </div>
    </div>
  );
};
