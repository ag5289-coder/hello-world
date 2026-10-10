"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main
            style={{
                minHeight: "calc(100vh - 56px)",
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
                    maxWidth: 380,
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <h1 style={{ margin: "0 0 8px", fontSize: 26, color: "#2d2d2d" }}>
                    Welcome back
                </h1>
                <p style={{ margin: "0 0 28px", color: "#666", fontSize: 15 }}>
                    Log in to make and vote on memes
                </p>

                <button
                    onClick={handleLogin}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        width: "100%",
                        background: "white",
                        color: "#333",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: "12px 16px",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path
                            fill="#FFC107"
                            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
                        />
                        <path
                            fill="#FF3D00"
                            d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                        />
                        <path
                            fill="#4CAF50"
                            d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.2 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.6 39.7 16.3 44 24 44z"
                        />
                        <path
                            fill="#1976D2"
                            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.4C41.3 36 44 30.5 44 24c0-1.3-.1-2.5-.4-3.5z"
                        />
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </main>
    );
}