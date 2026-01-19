"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Join.module.css";
import { joinGroup } from "@/actions/rejoindre-groupe";

// Note: Dans Next.js 13+, params est passé aux composants clients également
export default function JoinPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [groupInfo, setGroupInfo] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Étape de "Contrôle" : On vérifie si le code est valide au chargement
  // (On pourrait aussi le faire côté serveur, mais ici on gère tout le feedback en client)

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      // Appel de la Server Action (Passage de main)
      const result = await joinGroup(formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Succès : Redirection vers le dashboard du groupe
        router.push(`/groups/${formData.get("groupId")}?joined=true`);
      }
    } catch (err) {
      setError("Une erreur technique est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.joinCard}>
        <h1 style={{ color: "var(--primary-blue)" }}>Rejoindre l'équipe</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <p>
          Tu es sur le point de rejoindre un groupe via un lien d'invitation.
        </p>

        <form onSubmit={handleJoin}>
          {/* On passe l'ID du groupe via un champ caché ou on le récupère du code */}
          <input type="hidden" name="inviteCode" value={params.code} />

          <div className={styles.warningBox}>
            ! Attention : Tu ne peux appartenir qu'à{" "}
            <strong>un seul groupe</strong> à la fois.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? "Vérification..." : "Confirmer la jonction"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.back()}
          className={styles.secondaryBtn}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
