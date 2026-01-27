import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel/Carousel";
import type { Book } from "../../types/book";
import { getAllBooks, getBooksByCategory } from "../../services/bookService";

const categories = [
  "Terror",
  "Fantasía",
  "Programación",
  "Romance",
  "Ciencia Ficción",
  "Desarrollo Personal",
];

export default function Home() {
  const [booksByCategory, setBooksByCategory] = useState<
    Record<string, Book[]>
  >({});
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        //Cargar TODOS los libros primero
        const allBooks = await getAllBooks();

        // Seleccionar 10 aleatorios como recomendados
        const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 5));

        // Cargar por categorías
        const data: Record<string, Book[]> = {};

        for (const category of categories) {
          try {
            const books = await getBooksByCategory(category);
            data[category] = books;
          } catch (error) {
            console.error("Error cargando", category, error);
          }
        }

        setBooksByCategory(data);
      } catch (error) {
        console.error("Error general cargando libros", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>Cargando libros...</div>
    );
  }

  return (
    <div style={{ background: "#151515ff", minHeight: "100vh" }}>
      {/*RECOMENDADOS REALES */}
      {recommended.length > 0 && (
        <Carousel title="Recomendados" books={recommended} />
      )}

      {/*CARRUSELES POR CATEGORÍA */}
      {categories.map(
        (category) =>
          booksByCategory[category]?.length > 0 && (
            <Carousel
              key={category}
              title={category}
              books={booksByCategory[category]}
            />
          )
      )}
    </div>
  );
}
