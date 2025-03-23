import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookie = await cookies();
  const token = cookie.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }
  try {
    redirect("/dashboard");
  } catch {
    redirect("/login");
  }
}
