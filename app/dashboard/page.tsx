import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

    const needsInfo = !profile?.first_name || !profile?.last_name;

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: 16,
                    padding: "40px 48px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    maxWidth: 420,
                    textAlign: "center",
                }}
            >
                <h1 style={{ margin: "0 0 12px", fontSize: 28, color: "#2d2d2d" }}>
                    Dashboard
                </h1>
                {needsInfo ? (
                    <p style={{ color: "#555", fontSize: 16, lineHeight: 1.5 }}>
                        Welcome! Please{" "}
                        <Link
                            href="/profile"
                            style={{ color: "#764ba2", fontWeight: 600, textDecoration: "none" }}
                        >
                            complete your profile
                        </Link>{" "}
                        to get started.
                    </p>
                ) : (
                    <p style={{ color: "#555", fontSize: 18 }}>
                        Welcome back, <strong>{profile.first_name}</strong>! 👋
                    </p>
                )}
            </div>
        </main>
    );
}