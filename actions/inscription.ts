"use server";

import bcrypt from "bcrypt";
import { uploadToCloudinary } from "@/lib/files";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
  if (
    (await prisma.user.findFirst({
      where: {
        email: formData.get("email") as string,
      },
    })) != null
  ) {
    return {
      success: false,
      error: "Cet email est déjà utilisé",
    };
  }

  const password = formData.get("mdp") as string;
  const photoFile = formData.get("photo") as File;
  const cvFile = formData.get("cv") as File;

  // 1. Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const photoUrl = (await uploadToCloudinary(
      photoFile,
      "seic_photos",
    )) as string;
    let cvUrl = null;
    if (cvFile && cvFile.size > 0) {
      cvUrl = (await uploadToCloudinary(cvFile, "seic_cvs")) as string;
    }

    // 3. Création dans la DB
    const newUser = await prisma.user.create({
      data: {
        firstName: formData.get("prenom") as string,
        lastName: formData.get("nom") as string,
        email: formData.get("email") as string,
        password: hashedPassword,
        skills: "",
        level: formData.get("niveau") as string,
        photoUrl: photoUrl,
        cvUrl: cvUrl,
        description: formData.get("description") as string,
        canPitch: formData.get("pitch") === "on",
      },
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return {
      success: false,
      error: "Erreur lors de l'inscription. Veuillez réesayer plus tard",
    };
  }
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}

export async function getGroupCreatedByUser(userId: string) {
  return await prisma.group.findMany({
    where: {
      members: {
        some: {
          id: userId,
          isLeader: true,
        },
      },
    },
  });
}

export async function checkUserHasGroup(userId: string): Promise<boolean> {
  const group = await prisma.group.findMany({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
  });

  return group.length > 0;
}

export async function getGroups() {
  return await prisma.group.findMany({
    include: {
      members: { select: { id: true } },
      projects: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
