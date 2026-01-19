"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function joinGroup(formData: FormData) {
  const inviteCode = formData.get("inviteCode") as string;
  const userId = "id_user_actuel"; // À remplacer par ta session (ex: auth())

  try {
    // 1. Trouver le groupe par le code
    const group = await prisma.group.findUnique({
      where: { inviteCode },
      select: { id: true, name: true },
    });

    if (!group) return { error: "Code d'invitation invalide ou expiré." };

    // 2. Vérifier si l'utilisateur est déjà dans un groupe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { groupId: true },
    });

    if (user?.groupId) {
      return {
        error:
          "Tu as déjà un groupe. Quitte ton groupe actuel pour en rejoindre un nouveau.",
      };
    }

    // 3. Mise à jour atomique
    await prisma.user.update({
      where: { id: userId },
      data: { groupId: group.id },
    });

    // 4. Rafraîchir les données pour la page du groupe
    revalidatePath(`/groups/${group.id}`);

    return { success: true, groupId: group.id };
  } catch (e) {
    return { error: "Erreur lors de la jonction au groupe." };
  }
}
