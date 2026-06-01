import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params },
) {
  const param = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }

  const link = await prisma.link.findFirst({
    where: { id: param.id, userId: session.user.id },
  });

  if (!link) {
    return NextResponse.json({ error: "لینک پیدا نشد" }, { status: 404 });
  }

  await prisma.link.update({
    where: { id: param.id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  _req: NextRequest,
  { params } 
) {
  const getParams= await params;
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }

  const link = await prisma.link.findFirst({
    where: { id: getParams.id, userId: session.user.id },
  });

  if (!link) {
    return NextResponse.json({ error: "لینک پیدا نشد" }, { status: 404 });
  }

  // Only allow restore within 10 minutes
  if (link.deletedAt) {
    const diff = Date.now() - link.deletedAt.getTime();
    if (diff > 10 * 60 * 1000) {
      return NextResponse.json(
        { error: "مهلت بازگردانی به پایان رسیده" },
        { status: 400 },
      );
    }
  }

  await prisma.link.update({
    where: { id: getParams.id },
    data: { deletedAt: null },
  });

  return NextResponse.json({ success: true });
}
