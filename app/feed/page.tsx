import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VoteButtons from "./VoteButtons";

const TEMPLATE_SRC: Record<string, string> = {
    drake: "/memes/drake.jpg",
    distracted: "/memes/distracted.jpg",
    onedoesnot: "/memes/onedoesnot.jpg",
};

export const dynamic = "force-dynamic";

export default async function FeedPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: generations } = await supabase
        .from("generations")
        .select("id, template, prompt, top_text, bottom_text, created_at")
        .order("created_at", { ascending: false });

    const { data: votes } = await supabase
        .from("votes")
        .select("generation_id, user_id, value");

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
                <h1 style={{ fontSize: 28, margin: "0 0 24px", color: "#2d2d2d" }}>
                    The Feed
                </h1>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {generations?.map((gen) => {
                        const genVotes = votes?.filter((v) => v.generation_id === gen.id) ?? [];
                        const score = genVotes.reduce((sum, v) => sum + v.value, 0);
                        const myVote = genVotes.find((v) => v.user_id === user.id)?.value ?? 0;

                        return (
                            <div
                                key={gen.id}
                                style={{
                                    background: "white",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    border: "1px solid #e6e2f0",
                                }}
                            >
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={TEMPLATE_SRC[gen.template]}
                                        alt={gen.prompt}
                                        style={{ width: "100%", display: "block" }}
                                    />
                                    <div style={memeTextStyle("top")}>{gen.top_text.toUpperCase()}</div>
                                    <div style={memeTextStyle("bottom")}>{gen.bottom_text.toUpperCase()}</div>
                                </div>
                                <div
                                    style={{
                                        padding: "12px 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span style={{ fontSize: 13, color: "#888" }}>{gen.prompt}</span>
                                    <VoteButtons generationId={gen.id} score={score} myVote={myVote} />
                                </div>
                            </div>
                        );
                    })}

                    {(!generations || generations.length === 0) && (
                        <p style={{ color: "#888" }}>No memes yet. Go make one!</p>
                    )}
                </div>
            </div>
        </main>
    );
}

function memeTextStyle(pos: "top" | "bottom"): React.CSSProperties {
    return {
        position: "absolute",
        left: 0,
        right: 0,
        [pos]: 10,
        textAlign: "center",
        color: "white",
        fontWeight: 800,
        fontSize: 20,
        textShadow:
            "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
        padding: "0 10px",
        lineHeight: 1.2,
    } as React.CSSProperties;
}