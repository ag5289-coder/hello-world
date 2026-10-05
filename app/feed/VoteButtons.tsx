"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VoteButtons({
                                        generationId,
                                        score,
                                        myVote,
                                    }: {
    generationId: string;
    score: number;
    myVote: number;
}) {
    const supabase = createClient();
    const [currentScore, setCurrentScore] = useState(score);
    const [currentVote, setCurrentVote] = useState(myVote);
    const [busy, setBusy] = useState(false);

    const vote = async (value: 1 | -1) => {
        if (busy) return;
        setBusy(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            setBusy(false);
            return;
        }

        if (currentVote === value) {
            // clicking the same vote again removes it
            await supabase
                .from("votes")
                .delete()
                .eq("generation_id", generationId)
                .eq("user_id", user.id);
            setCurrentScore(currentScore - value);
            setCurrentVote(0);
        } else {
            await supabase.from("votes").upsert(
                {
                    generation_id: generationId,
                    user_id: user.id,
                    value,
                },
                { onConflict: "generation_id,user_id" }
            );
            setCurrentScore(currentScore - currentVote + value);
            setCurrentVote(value);
        }

        setBusy(false);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
                onClick={() => vote(1)}
                disabled={busy}
                style={{
                    border: "none",
                    background: currentVote === 1 ? "#764ba2" : "#eee",
                    color: currentVote === 1 ? "white" : "#555",
                    borderRadius: 6,
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    fontSize: 14,
                }}
            >
                ▲
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: "center" }}>
        {currentScore}
      </span>
            <button
                onClick={() => vote(-1)}
                disabled={busy}
                style={{
                    border: "none",
                    background: currentVote === -1 ? "#764ba2" : "#eee",
                    color: currentVote === -1 ? "white" : "#555",
                    borderRadius: 6,
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    fontSize: 14,
                }}
            >
                ▼
            </button>
        </div>
    );
}