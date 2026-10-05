import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { prompt, template } = await request.json();

    if (!prompt || !template) {
        return NextResponse.json({ error: "Missing prompt or template" }, { status: 400 });
    }

    const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You write short, funny meme captions for a college student in NYC. Given the topic "${prompt}", write a top line and a bottom line for a meme, in the classic top-text/bottom-text format. Keep each line under 8 words. Respond with ONLY valid JSON, no markdown, in this exact shape: {"top": "...", "bottom": "..."}`,
                            },
                        ],
                    },
                ],
            }),
        }
    );

    if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return NextResponse.json({ error: `Gemini error: ${errText}` }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let top = "";
    let bottom = "";
    try {
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        top = parsed.top ?? "";
        bottom = parsed.bottom ?? "";
    } catch {
        return NextResponse.json({ error: "Could not parse AI response" }, { status: 500 });
    }

    const { data, error } = await supabase
        .from("generations")
        .insert({
            user_id: user.id,
            template,
            prompt,
            top_text: top,
            bottom_text: bottom,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ generation: data });
}