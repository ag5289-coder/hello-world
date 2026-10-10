"use client";

import { useState } from "react";

const TEMPLATES = [
    { id: "drake", label: "Drake", src: "/memes/drake.jpg" },
    { id: "distracted", label: "Distracted Boyfriend", src: "/memes/distracted.jpg" },
    { id: "onedoesnot", label: "One Does Not Simply", src: "/memes/onedoesnot.jpg" },
];

export default function GeneratePage() {
    const [template, setTemplate] = useState("drake");
    const [prompt, setPrompt] = useState("");
    const [topText, setTopText] = useState("");
    const [bottomText, setBottomText] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setStatus("");

        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, template }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setStatus(`Error: ${data.error ?? "something went wrong"}`);
            return;
        }

        setTopText(data.generation.top_text);
        setBottomText(data.generation.bottom_text);
        setStatus("Meme created! Check the feed to see it with everyone else's.");
    };

    const selected = TEMPLATES.find((t) => t.id === template)!;

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f6f4fb",
                fontFamily: "system-ui, sans-serif",
                padding: "48px 24px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div style={{ maxWidth: 480, width: "100%" }}>
                <h1 style={{ fontSize: 28, margin: "0 0 20px", color: "#2d2d2d" }}>
                    Make a meme
                </h1>

                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTemplate(t.id)}
                            style={{
                                flex: 1,
                                padding: "8px 6px",
                                borderRadius: 8,
                                border: template === t.id ? "2px solid #764ba2" : "1px solid #ccc",
                                background: template === t.id ? "#efe7f9" : "white",
                                cursor: "pointer",
                                fontSize: 13,
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        borderRadius: 12,
                        overflow: "hidden",
                        marginBottom: 20,
                        border: "1px solid #ddd",
                    }}
                >
                    <img src={selected.src} alt={selected.label} style={{ width: "100%", display: "block" }} />
                    {topText && (
                        <div style={memeTextStyle("top")}>{topText.toUpperCase()}</div>
                    )}
                    {bottomText && (
                        <div style={memeTextStyle("bottom")}>{bottomText.toUpperCase()}</div>
                    )}
                </div>

                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. waiting for the 1 train at 2am"
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        fontSize: 15,
                        marginBottom: 12,
                        boxSizing: "border-box",
                    }}
                />

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: "#764ba2",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "12px",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: loading ? "default" : "pointer",
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? "Generating..." : "Generate caption"}
                </button>

                {status && (
                    <p style={{ marginTop: 14, fontSize: 14, color: "#555" }}>{status}</p>
                )}
            </div>
        </main>
    );
}

function memeTextStyle(pos: "top" | "bottom"): React.CSSProperties {
    return {
        position: "absolute",
        left: 0,
        right: 0,
        [pos]: 14,
        textAlign: "center",
        color: "white",
        fontFamily: "'Arial Black', Impact, sans-serif",
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        textShadow:
            "3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 0 8px rgba(0,0,0,0.5)",
        padding: "0 14px",
        lineHeight: 1.15,
    } as React.CSSProperties;
}