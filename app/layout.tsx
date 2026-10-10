import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <html lang="en">
        <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 24px",
                background: "#2b2238",
                color: "white",
            }}
        >
            <Link
                href="/"
                style={{ color: "white", fontWeight: 700, textDecoration: "none", fontSize: 18 }}
            >
                NYC Memes
            </Link>

            <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 14 }}>
                {user ? (
                    <>
                        <Link href="/generate" style={navLink}>
                            Generate
                        </Link>
                        <Link href="/feed" style={navLink}>
                            Feed
                        </Link>
                        <Link href="/dashboard" style={navLink}>
                            Dashboard
                        </Link>
                        <Link href="/profile" style={navLink}>
                            Profile
                        </Link>
                    </>
                ) : (
                    <Link href="/login" style={navLink}>
                        Log in
                    </Link>
                )}
            </div>
        </nav>
        {children}
        </body>
        </html>
    );
}

const navLink: React.CSSProperties = {
    color: "#e4def0",
    textDecoration: "none",
};