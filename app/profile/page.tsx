"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
    const supabase = createClient();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const load = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const { data } = await supabase
                .from("profiles")
                .select("first_name, last_name, avatar_url")
                .eq("id", user.id)
                .single();

            if (data) {
                setFirstName(data.first_name ?? "");
                setLastName(data.last_name ?? "");
                setAvatarUrl(data.avatar_url);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        if (!userId) return;
        setStatus("Saving...");
        const { error } = await supabase
            .from("profiles")
            .update({ first_name: firstName, last_name: lastName })
            .eq("id", userId);
        setStatus(error ? `Error: ${error.message}` : "Saved!");
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        setStatus("Uploading...");
        const filePath = `${userId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            setStatus(`Upload error: ${uploadError.message}`);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
        setAvatarUrl(publicUrl);
        setStatus("Photo updated!");
    };

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
                    width: 360,
                    textAlign: "center",
                }}
            >
                <h1 style={{ margin: "0 0 20px", fontSize: 26, color: "#2d2d2d" }}>
                    Your Profile
                </h1>

                <div
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        margin: "0 auto 16px",
                        background: avatarUrl ? `url(${avatarUrl})` : "#eee",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "3px solid #764ba2",
                    }}
                />

                <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: 20 }} />

                <div style={{ textAlign: "left", marginBottom: 12 }}>
                    <label style={{ fontSize: 14, color: "#555" }}>First name</label>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 10px",
                            marginTop: 4,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            fontSize: 15,
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                <div style={{ textAlign: "left", marginBottom: 20 }}>
                    <label style={{ fontSize: 14, color: "#555" }}>Last name</label>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 10px",
                            marginTop: 4,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            fontSize: 15,
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                <button
                    onClick={handleSave}
                    style={{
                        background: "#764ba2",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 24px",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Save
                </button>

                {status && <p style={{ marginTop: 14, fontSize: 14, color: "#555" }}>{status}</p>}
            </div>
        </main>
    );
}