import { getGroups } from "@/actions/inscription";
import Admin from "./Admin";

export default async function AdminPage() {
  const groups = await getGroups();

  return <Admin groups={groups} />;
}
