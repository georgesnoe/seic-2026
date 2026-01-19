"use client";

import { useState } from "react";
import { toggleGroupValidation } from "@/actions/admin";
import styles from "@/styles/admin.module.css";

export default function ValidationButton({
  groupId,
  isValidated,
}: {
  groupId: string;
  isValidated: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleGroupValidation(groupId, isValidated);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={isValidated ? styles.unvalidateBtn : styles.validateBtn}
    >
      {loading ? "..." : isValidated ? "Invalider" : "Valider"}
    </button>
  );
}
