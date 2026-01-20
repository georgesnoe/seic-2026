import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "@/styles/liste-groupes.module.css";

export default async function GroupsListPage() {
  // Récupération des groupes avec le nombre de membres
  const groups = await prisma.group.findMany({
    include: {
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <h1 style={{ color: "var(--primary-blue)" }}>Groupes de l'événement</h1>
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Découvrez les équipes et leurs visions pour cette édition.</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <a href="/creer-groupe">Créer un groupe</a>
          <a href="/inscription">S'inscrire</a>
        </div>
      </p>

      <div className={styles.grid}>
        {groups.map((group) => (
          <div
            key={group.id}
            className={`${styles.card} ${group.isValidated ? styles.cardValidated : ""}`}
          >
            <div>
              <div className={styles.cardTitle}>
                <h3>{group.name}</h3>
                <span
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: group.isValidated ? "#d4edda" : "#f8d7da",
                    color: group.isValidated ? "#155724" : "#721c24",
                  }}
                >
                  {group.isValidated ? "Validé" : "En attente"}
                </span>
              </div>

              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {group.vision.substring(0, 100)}...
              </p>

              <div className={styles.memberCount}>
                👥 {group._count.members} membre(s)
              </div>
            </div>

            <Link href={`/groupes/${group.id}`} className={styles.viewBtn}>
              Voir les détails
            </Link>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Aucun groupe n'a été créé pour le moment.
        </p>
      )}
    </div>
  );
}
