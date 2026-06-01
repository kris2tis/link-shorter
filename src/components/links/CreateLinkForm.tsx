"use client";

import { useState } from "react";
import {
  Link2,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createLinkSchema } from "@/lib/validations";
import { getShortUrl } from "@/lib/utils";
import { http } from "@/httpServices";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {useRouter} from "next/navigation"
import { useSession } from "next-auth/react";
interface Props {
  onCreated?: () => void;
}

const EXPIRY_OPTIONS = [
  { label: "بدون انقضا", value: "" },
  { label: "۱ ساعت", value: "1h" },
  { label: "۲۴ ساعت", value: "24h" },
  { label: "۷ روز", value: "7d" },
  { label: "۳۰ روز", value: "30d" },
  { label: "تاریخ دلخواه", value: "custom" },
];

function getExpiryDate(value: string): string {
  if (!value || value === "custom") return "";
  const now = new Date();
  const map: Record<string, number> = {
    "1h": 1 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  const expiryDate = new Date(now.getTime() + map[value]);

  return formatDateLocal(expiryDate);
}

function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function CreateLinkForm({ onCreated }: Props) {
  const { data: session, status } = useSession();
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiry, setExpiry] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [createdLink, setCreatedLink] = useState<{ slug: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();
  const {push} = useRouter()
  const getExpiresAt = () => {
    if (!expiry || expiry === "") return "";
    if (expiry === "custom") return customDate;
    return getExpiryDate(expiry);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if(!session)  push("/auth")

    e.preventDefault();
    setError("");
    setFieldErrors({});

    const expiresAt = getExpiresAt();
    const payload = {
      url,
      customSlug: customSlug.trim() || undefined,
      expiresAt: expiresAt || undefined,
    };

    const result = createLinkSchema.safeParse(payload);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) errors[e.path[0] as string] = e.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const data = await http.post("/api/links", payload).then((data)=>data.data);

      queryClient.invalidateQueries({ queryKey: ["link-list"] });
      toast.success("لینک ساخته شد", { position: "bottom-center" });
      setCreatedLink(data?.link);
      setUrl("");
      setCustomSlug("");
      setExpiry("");
      setCustomDate("");
      onCreated?.();
    } catch {
      setError("خطای شبکه. لطفاً دوباره امتحان کنید.");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    await navigator.clipboard.writeText(getShortUrl(createdLink.slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (createdLink) {
    return (
      <div className="card p-6 animate-slide-in">
        <div className="flex items-center gap-2 text-green-600 font-medium mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          لینک کوتاه ساخته شد
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
          <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span
            className="flex-1 font-mono text-sky-600 text-sm truncate"
            dir="ltr"
          >
            {getShortUrl(createdLink.slug)}
          </span>
          <button
            onClick={handleCopy}
            className="btn-secondary py-1.5 px-3 text-xs shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" /> کپی شد
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> کپی
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setCreatedLink(null)}
          className="btn-primary w-full"
        >
          ساخت لینک جدید
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6 mt-5">
      <h2 className="text-base font-semibold  text-slate-800 mb-8 flex justify-center items-center gap-2">
        <Link2 className="w-4 h-4 text-sky-500" />
        ساخت لینک کوتاه
      </h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            آدرس لینک اصلی <span className="text-red-500">*</span>
          </label>
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setFieldErrors((fe) => ({ ...fe, url: "" }));
            }}
            placeholder="https://example.com/very/long/link"
            dir="ltr"
            className={`input-field ${fieldErrors.url ? "border-red-400 focus:ring-red-400/30 focus:border-red-400" : ""}`}
          />
          {fieldErrors.url && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <span>⚠️</span> {fieldErrors.url}
            </p>
          )}
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          تنظیمات پیشرفته
        </button>

        {showAdvanced && (
          <div className="space-y-4 animate-slide-in  border-t border-slate-100 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                آدرس کوتاه دلخواه
                <span className="text-xs text-slate-400 font-normal mr-2">
                  (اختیاری)
                </span>
              </label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-3 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl text-sm text-slate-500 flex-shrink-0">
                  /
                </span>
                <input
                  value={customSlug}
                  onChange={(e) => {
                    setCustomSlug(e.target.value);
                    setFieldErrors((fe) => ({ ...fe, customSlug: "" }));
                  }}
                  placeholder="my-link"
                  dir="ltr"
                  className={`input-field rounded-r-none ${fieldErrors.customSlug ? "border-red-400" : ""}`}
                />
              </div>
              {fieldErrors.customSlug && (
                <p className="mt-1.5 text-xs text-red-500">
                  ⚠️ {fieldErrors.customSlug}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                حروف انگلیسی، عدد، خط تیره — بین ۳ تا ۳۰ کاراکتر
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                زمان انقضا
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExpiry(opt.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      expiry === opt.value
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {expiry === "custom" && (
                <input
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`input-field ${fieldErrors.expiresAt ? "border-red-400" : ""}`}
                  dir="ltr"
                />
              )}
              {fieldErrors.expiresAt && (
                <p className="mt-1.5 text-xs text-red-500">
                  ⚠️ {fieldErrors.expiresAt}
                </p>
              )}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
          ساخت لینک کوتاه
        </button>
      </form>
    </div>
  );
}
