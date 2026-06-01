import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createLinkSchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }

  const links = await prisma.link.findMany({
    where: { userId: session.user.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = createLinkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 },
      );
    }

    const { url, customSlug, expiresAt } = result.data;
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const slug = customSlug?.trim() || nanoid(7);

    const existingSlug = await prisma.link.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        {
          error:
            "این آدرس کوتاه قبلاً استفاده شده — لطفاً آدرس دیگری انتخاب کنید",
        },
        { status: 409 },
      );
    }

    const link = await prisma.link.create({
      data: {
        slug,
        url: normalizedUrl,
        userId: session.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({}, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
