import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontFamily: "system-ui, sans-serif",
                padding: 24,
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: 16,
                    padding: "48px 40px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    maxWidth: 440,
                    textAlign: "center",
                }}
            >
                <h1 style={{ margin: "0 0 12px", fontSize: 32, color: "#2d2d2d" }}>
                    NYC Meme Generator
                </h1>
                <p style={{ margin: "0 0 28px", color: "#555", fontSize: 16, lineHeight: 1.5 }}>
                    Turn any New York moment into a meme, then see what everyone else made.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Link
                        href="/generate"
                        style={{
                            background: "#764ba2",
                            color: "white",
                            padding: "12px 20px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        Make a meme
                    </Link>
                    <Link
                        href="/feed"
                        style={{
                            background: "#f1edf7",
                            color: "#4a3a63",
                            padding: "12px 20px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        See the feed
                    </Link>
                    {!user && (
                        <Link
                            href="/login"
                            style={{
                                color: "#764ba2",
                                fontSize: 14,
                                marginTop: 4,
                                textDecoration: "underline",
                            }}
                        >
                            Log in with Google
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}