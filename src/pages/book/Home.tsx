import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import type { Book } from "../../types/book";
import { getAllBooks, getBooksByCategory } from "../../services/bookService";
import { getAllCategories } from "../../services/CategoryService";


export default function Home() {

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      // Mapeamos solo el nombre porque tu lógica actual usa strings
      const categoryNames = data.map((c) => c.name);
      setCategories(categoryNames);
    };

    fetchCategories();
  }, []);
  
  const [booksByCategory, setBooksByCategory] = useState<
    Record<string, Book[]>
  >({});

  // Filtro por categorias
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  //Recomendados y efecto de carga
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

        for (const cat of categories) {
          try {
            const books = await getBooksByCategory(cat);
            data[cat] = books;
          } catch (error) {
            console.error("Error cargando", cat, error);
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
  }, [categories, category]);

  if (loading) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>Cargando libros...</div>
    );
  }

  const categoriesToShow = category ? [category] : categories;


  return (
    <div style={{ background: "#151515ff", minHeight: "100vh" }}>
      {/*RECOMENDADOS REALES */}
      {!category && recommended.length > 0 && (
        <Carousel title="Recomendados" books={recommended} />
      )}


      {/*CARRUSELES POR CATEGORÍA */}
      {categoriesToShow.map(
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
