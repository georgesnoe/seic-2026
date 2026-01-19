"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { getUserByEmail, registerUser } from "@/actions/inscription";
import styles from "@/styles/inscription.module.css";

export default function RegisterPage() {
  useEffect(() => {
    const info = localStorage.getItem("user");
    if (info !== null) {
      const parsedInfo = JSON.parse(info);
      getUserByEmail(parsedInfo.email).then((user) => {
        if (JSON.stringify(user) === JSON.stringify(parsedInfo)) {
          redirect("/groupes");
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await registerUser(formData);

    if (result.success) {
      alert("Inscription réussie !");
    } else {
      alert(result.error);
    }

    localStorage.setItem("user", JSON.stringify(result.user));
    redirect("/groupes");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Inscription SEIC 2026</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="prenom">
              Prénom
            </label>
            <input
              type="text"
              className={styles.input}
              name="prenom"
              id="prenom"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="nom">
              Nom
            </label>
            <input
              type="text"
              className={styles.input}
              name="nom"
              id="nom"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            className={styles.input}
            name="email"
            id="email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="mdp">
            Mot de passe
          </label>
          <input
            type="password"
            className={styles.input}
            name="mdp"
            id="mdp"
            minLength={8}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="niveau">
            Niveau
          </label>
          <select className={styles.select} name="niveau" id="niveau" required>
            <option value="">-- Veuillez selectionner un niveau --</option>
            <option value="b1si">B1SI</option>
            <option value="b1m">B1M</option>
            <option value="b2si">B2SI</option>
            <option value="b2m">B2M</option>
            <option value="b3si">B3SI</option>
            <option value="b3m">B3M</option>
            <option value="m1si">M1SI</option>
            <option value="m1m">M1M</option>
            <option value="m2si">M2SI</option>
            <option value="m2m">M2M</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="photo">
            Photo de profil
          </label>
          <input
            type="file"
            accept="image/*"
            className={styles.input}
            name="photo"
            id="photo"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">
            Description (doit inclure tes compétences)
          </label>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="Parle-nous de toi..."
            name="description"
            id="description"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="cv">
            CV (Optionnel)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className={styles.input}
            name="cv"
            id="cv"
          />
        </div>

        <div
          className={styles.formGroup}
          style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}
        >
          <input type="checkbox" id="pitch" name="pitch" />
          <label
            htmlFor="pitch"
            className={styles.label}
            style={{ marginBottom: 0 }}
          >
            Je suis capable de pitcher un projet
          </label>
        </div>

        <button type="submit" className={styles.submitBtn}>
          S'inscrire
        </button>
      </form>
    </div>
  );
}
