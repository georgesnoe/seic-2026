"use server";

import { checkAdmin } from "@/lib/auth-proxy";
import { prisma } from "@/lib/prisma";

export async function toggleGroupValidation(
  groupId: string,
  currentStatus: boolean,
) {
  // Le proxy jette une erreur ou redirige si l'user n'est pas ADMIN
  await checkAdmin();

  try {
    return await prisma.group.update({
      where: { id: groupId },
      data: { isValidated: !currentStatus },
    });
  } catch (e) {
    return { error: "Action échouée" };
  }
}
