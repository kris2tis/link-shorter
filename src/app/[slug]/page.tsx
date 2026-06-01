import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const link = await prisma.link.findUnique({
    where: { slug: slug, deletedAt: null },
  });

  if (!link) notFound();

  if (link.expiresAt && new Date() > link.expiresAt) {
    redirect("/expired");
  }

  prisma.link
    .update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
    .catch(() => {});

  redirect(link.url);
}
