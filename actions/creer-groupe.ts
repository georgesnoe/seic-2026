"use server";

import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function createGroup(formData: FormData) {
  // Simuler une récupération d'ID utilisateur (ex: via NextAuth)
  const userId = formData.get("userId") as string;

  try {
    // 1. Check si l'user a déjà un groupe (Sécurité supplémentaire)
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (currentUser?.groupId) {
      return { error: "Vous appartenez déjà à un groupe !" };
    }

    const newGroup = await prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: formData.get("nom-groupe") as string,
          vision: formData.get("vision-groupe") as string,
          description: formData.get("vision-groupe") as string,
          inviteCode: nanoid(10),
        },
      });

      const projectsData = [1, 2, 3].map((num) => ({
        title: formData.get(`titre_projet_${num}`) as string,
        description: formData.get(`description_projet_${num}`) as string,
        groupId: group.id,
      }));

      await tx.project.createMany({ data: projectsData });

      await tx.user.update({
        where: { id: userId },
        data: { groupId: group.id, isLeader: true },
      });

      return group;
    });

    return { success: true, groupId: newGroup.id };
  } catch (error) {
    console.error(error);
    return { error: "Échec de la création. Vérifiez les données." };
  }
}
