import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
    const { data: books, error } = await supabase.from("books").select("*");

    if (error) {
        return <p style={{ padding: 24 }}>Error loading data: {error.message}</p>;
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f6f4fb",
                fontFamily: "system-ui, sans-serif",
                color: "#222",
                padding: "48px 24px",
            }}
        >
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <h1 style={{ fontSize: 32, margin: 0 }}>Books</h1>
                <p style={{ color: "#666", margin: "6px 0 28px" }}>
                    {books?.length ?? 0} books on the list
                </p>

                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "grid",
                        gap: 12,
                    }}
                >
                    {books?.map((book) => (
                        <li
                            key={book.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                padding: 16,
                                background: "#fff",
                                border: "1px solid #e6e2f0",
                                borderRadius: 12,
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 60,
                                    borderRadius: 6,
                                    background: "#7c5cbf",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: 20,
                                    flexShrink: 0,
                                }}
                            >
                                {book.title.charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 600 }}>{book.title}</div>
                                <div style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
                                    {book.author}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}