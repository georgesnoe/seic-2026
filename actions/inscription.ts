"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/files";

export async function registerUser(formData: FormData) {
  const password = formData.get("mdp") as string;
  const photoFile = formData.get("photo") as File;
  const cvFile = formData.get("cv") as File;

  // 1. Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Fonction helper pour uploader sur Cloudinary

  try {
    const photoUrl = (await uploadToCloudinary(
      photoFile,
      "event_photos",
    )) as string;
    let cvUrl = null;
    if (cvFile && cvFile.size > 0) {
      cvUrl = (await uploadToCloudinary(cvFile, "event_cvs")) as string;
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
        canPitch: formData.get("pitch") === "on", // Les checkbox renvoient "on" si cochées
      },
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return { success: false, error: "Erreur lors de l'inscription" };
  }
}
