import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .max(50, "نام نمی‌تواند بیشتر از ۵۰ حرف باشد"),
  email: z.string().min(1, "ایمیل الزامی است").email("فرمت ایمیل صحیح نیست"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
    .regex(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "ایمیل الزامی است").email("فرمت ایمیل صحیح نیست"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

const RESERVED_SLUGS = [
  "api",
  "auth",
  "dashboard",
  "admin",
  "login",
  "register",
  "profile",
  "settings",
  "about",
  "contact",
];

  const DOMAIN_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;

export const createLinkSchema = z.object({
  url: z
    .string()
    .min(3, "آدرس لینک الزامی است")
    .refine((val) => {
      try {
        if (DOMAIN_REGEX.test(val)) return true
      } catch {
        return false;
      }
    }, "آدرس وارد شده معتبر نیست — لطفاً یک URL کامل مثل https://example.com وارد کنید"),
  customSlug: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      return /^[a-zA-Z0-9_-]{3,30}$/.test(val);
    }, "آدرس دلخواه باید ۳ تا ۳۰ کاراکتر و فقط شامل حروف انگلیسی، عدد، خط تیره یا زیرخط باشد")
    .refine((val) => {
      if (!val || val === "") return true;
      return !RESERVED_SLUGS.includes(val.toLowerCase());
    }, "این آدرس رزرو شده است — لطفاً آدرس دیگری انتخاب کنید"),
  expiresAt: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      const date = new Date(val);
      return date > new Date();
    }, "تاریخ انقضا باید در آینده باشد"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
