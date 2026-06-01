# نحوه اجرای پروژه

## 1. کلون کردن پروژه

ابتدا پروژه را Clone کنید:

```bash
git clone <repository-url>
```

---

## 2. ساخت فایل Environment

در ریشه پروژه یک فایل `.env` ایجاد کرده و مقادیر زیر را تنظیم کنید:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/shortlink"
NEXTAUTH_SECRET="یک رشته تصادفی با حداقل 32 کاراکتر"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 3. نصب وابستگی‌ها

```bash
npm install
```

---

## 4. راه‌اندازی دیتابیس

یک دیتابیس PostgreSQL ایجاد کرده و مقدار `DATABASE_URL` را متناسب با محیط خود تنظیم کنید.

سپس مایگریشن‌ها را اجرا کرده و Prisma Client را بسازید:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## 5. اجرای پروژه

```bash
npm run dev
```

پس از اجرای موفق، پروژه روی آدرس زیر در دسترس خواهد بود:

```text
http://localhost:3000
```

> توجه: این پروژه Full Stack است و می‌توانید از PostgreSQL محلی یا سرویس‌های ابری مانند Neon استفاده کنید.

---

# تکنولوژی‌های اصلی پروژه

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

### Backend

* Next.js route handler
* PostgreSQL
* Prisma ORM

### Authentication

* NextAuth.js

### Data Fetching & State Management

* TanStack Query (React Query)
* Axios

### Validation & User Experience

* Zod
* Sonner (Toast Notifications)

---

# بخش‌های تکمیل‌شده

### مدیریت لینک‌ها

* ساخت لینک کوتاه
* تولید Slug اختصاصی
* مشاهده لینک‌های ایجادشده
* ویرایش لینک‌ها

### قابلیت‌های پیشرفته

* تعیین تاریخ انقضا
* حذف نرم (Soft Delete)
* بازیابی لینک حذف‌شده
* احراز هویت کاربران
* داشبورد مدیریت لینک‌ها

### داشبورد

* نمایش لینک‌های کاربر
* جستجو میان لینک‌ها
* مشاهده وضعیت لینک‌ها

---

# اگر بخشی کامل نشده، دلیل آن چه بوده است؟

به دلیل محدودیت زمانی، تمامی ایده‌ها و قابلیت‌های مدنظر در نسخه فعلی پیاده‌سازی نشده‌اند.

---

# اگر فرصت بیشتری وجود داشت، چه مواردی بهبود پیدا می‌کرد؟

### قابلیت‌های جدید

* تولید QR Code برای لینک‌های کوتاه
* صفحه پروفایل عمومی برای کسب‌وکارها
* آمار و گزارش‌های پیشرفته‌تر

### بهبودهای فنی و ظاهری

* بهبود رابط کاربری (UI)
* بهبود تجربه کاربری (UX)
* بهینه‌سازی بیشتر عملکرد سیستم در مقیاس بزرگ
* توسعه سیستم تحلیل کلیک‌ها و گزارش‌گیری
