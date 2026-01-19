import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function getSessionOrRedirect() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function checkAdmin() {
  const session = await getSessionOrRedirect();
  if ((session.user as any).role !== "ADMIN") {
    redirect("/"); // Ou une page 403
  }
  return session;
}
