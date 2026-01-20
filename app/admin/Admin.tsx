"use client";

import styles from "@/styles/admin.module.css";
import ValidationButton from "./ValidationButton"; // On crée ce petit composant client en dessous
import { getUserByEmail, getGroups } from "@/actions/inscription";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default async function AdminPage({ groups }: { groups: any }) {
  // Juste pour les admins
  useEffect(() => {
    const info = localStorage.getItem("user");
    if (info !== null) {
      const parsedInfo = JSON.parse(info);
      getUserByEmail(parsedInfo.email).then((user) => {
        if (JSON.stringify(user) === JSON.stringify(parsedInfo)) {
          if (user?.role !== "ADMIN") {
            redirect("/groupes");
          }
        } else {
          redirect("/inscription");
        }
      });
    }
  }, []);

  return (
    <div className={styles.adminContainer}>
      <h1 style={{ color: "var(--primary-blue)" }}>
        Panel Admin : Validation des Groupes
      </h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nom du Groupe</th>
            <th>Membres</th>
            <th>Projets</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group: any) => (
            <tr key={group.id}>
              <td>
                <strong>{group.name}</strong>
              </td>
              <td>{group.members.length} / 10</td>
              <td>{group.projects.length} projets créés</td>
              <td>
                <span
                  style={{
                    color: group.isValidated ? "#2ecc71" : "var(--primary-red)",
                  }}
                >
                  {group.isValidated ? "✅ Validé" : "⏳ En attente"}
                </span>
              </td>
              <td>
                <ValidationButton
                  groupId={group.id}
                  isValidated={group.isValidated}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
