import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  },
) {
  const {slug} = await params;
  const link = await prisma.link.findUnique({
    where: { slug: slug, deletedAt: null },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/not-found", _req.url));
  }

  if (link.expiresAt && new Date() > link.expiresAt) {
    return NextResponse.redirect(new URL("/expired", _req.url));
  }

  // Increment click count async
  prisma.link
    .update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.redirect(link.url);
}
