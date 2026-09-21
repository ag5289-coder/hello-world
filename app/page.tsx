import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  return (
      <main style={{ padding: 24 }}>
        <h1>Books</h1>
        <ul>
          {books?.map((book) => (
              <li key={book.id}>
                {book.title} by {book.author}
              </li>
          ))}
        </ul>
      </main>
  );
}