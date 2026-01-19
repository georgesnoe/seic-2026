import { prisma } from "@/lib/prisma";
import styles from "@/styles/dashboard-groupe.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. Récupération du groupe avec ses membres et projets
  const group = await prisma.group.findUnique({
    where: { id: params.id },
    include: {
      members: true,
      projects: true,
    },
  });

  if (!group) notFound();

  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/join/${group.inviteCode}`;

  return (
    <div className={styles.container}>
      {/* Header avec Statut de Validation */}
      <div className={styles.header}>
        <div>
          <h1>{group.name}</h1>
          <p>{group.vision}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              background: group.isValidated ? "#2ecc71" : "var(--primary-red)",
              padding: "5px 15px",
              borderRadius: "20px",
            }}
          >
            {group.isValidated
              ? "Validé par Admin"
              : "En attente de validation"}
          </span>
        </div>
      </div>

      {/* Zone d'invitation (visible par tous les membres ou seulement leader) */}
      <div className={styles.inviteBox}>
        <h3>Recrute ton équipe !</h3>
        <p>
          Partage ce lien pour inviter des membres (Max 1 groupe par personne)
        </p>
        <div className={styles.inviteLink}>
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className={styles.copyInput}
          />
          <button
            type="button"
            className={styles.submitBtn}
            style={{ width: "auto", padding: "10px 20px" }}
          >
            Copier
          </button>
        </div>
      </div>

      {/* Liste des Membres */}
      <h2>Membres de l'équipe</h2>
      <div className={styles.memberGrid}>
        {group.members.map((member) => (
          <div key={member.id} className={styles.memberCard}>
            {member.isLeader && <span className={styles.badge}>Leader</span>}
            <Image
              src={member.photoUrl}
              alt={member.firstName}
              className={styles.avatar}
            />
            <h4>
              {member.firstName} {member.lastName}
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--secondary-blue)" }}>
              {member.level}
            </p>
            {member.canPitch && <small>🎤 Pitcher</small>}
          </div>
        ))}
      </div>

      {/* Rappel des 3 Projets */}
      <h2 style={{ marginTop: "3rem" }}>Nos 3 Projets</h2>
      <div className={styles.projectGrid}>
        {group.projects.map((p, index) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "10px",
              borderLeft: "4px solid var(--primary-blue)",
            }}
          >
            <strong>
              Projet {index + 1}: {p.title}
            </strong>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
