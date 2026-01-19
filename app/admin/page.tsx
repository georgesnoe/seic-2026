import { prisma } from "@/lib/prisma";
import styles from "@/styles/admin.module.css";
import ValidationButton from "./ValidationButton"; // On crée ce petit composant client en dessous

export default async function AdminPage() {
  const groups = await prisma.group.findMany({
    include: {
      members: { select: { id: true } },
      projects: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

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
          {groups.map((group) => (
            <tr key={group.id}>
              <td>
                <strong>{group.name}</strong>
              </td>
              <td>{group.members.length} / 5</td>
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
