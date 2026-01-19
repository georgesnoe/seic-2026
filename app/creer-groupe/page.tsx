"use client";

import styles from "@/styles/creer-groupe.module.css";
import { createGroup } from "@/actions/creer-groupe";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getGroupCreatedByUser, getUserByEmail } from "@/actions/inscription";

export default function CreateGroupPage() {
  useEffect(() => {
    const info = localStorage.getItem("user");
    if (info !== null) {
      const parsedInfo = JSON.parse(info);
      getUserByEmail(parsedInfo.email).then((user) => {
        if (JSON.stringify(user) === JSON.stringify(parsedInfo)) {
          if (user?.isLeader) {
            getGroupCreatedByUser(user.id).then((group) => {
              redirect(`/groupes/${group[0].id}`);
            });
          }
        }
      });
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createGroup(formData);

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      } else if (result?.success) {
        // Redirection côté client après succès
        // router.push(`/groupes/${result.groupId}?welcome=true`);
        redirect(`/groupes/${result.groupId}`);
      }
    } catch (err) {
      setErrorMessage("Une erreur imprévue est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 style={{ color: "var(--primary-blue)" }}>Créer un nouveau groupe</h1>

      <form onSubmit={handleFormSubmit}>
        {/* Infos du Groupe */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="nom-groupe">
            Nom du groupe
          </label>
          <input
            type="text"
            name="nom-groupe"
            id="nom-groupe"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="vision-groupe">
            Vision du groupe
          </label>
          <textarea
            name="vision-groupe"
            id="vision-groupe"
            className={styles.textarea}
            rows={3}
            required
          />
        </div>

        {/* Section Projets */}
        <h3 className={styles.sectionTitle}>Les 3 Projets du groupe</h3>
        <p className={styles.helperText}>
          Chaque groupe doit soumettre exactement 3 idées de projets.
        </p>

        <div className={styles.projectGrid}>
          {[1, 2, 3].map((num) => (
            <div key={num} className={styles.projectCard}>
              <h4>Projet #{num}</h4>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name={`titre_projet_${num}`}
                  id={`titre_projet_${num}`}
                  placeholder="Titre du projet"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <textarea
                  name={`description_projet_${num}`}
                  id={`description_projet_${num}`}
                  placeholder="Description rapide"
                  className={styles.textarea}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          style={{ marginTop: "2rem" }}
        >
          Créer le groupe et inviter des membres
        </button>
      </form>
    </div>
  );
}
