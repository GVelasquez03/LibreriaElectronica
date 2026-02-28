import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import type { Book } from "../../types/book";
import { getAllBooks, getBooksByCategory, searchBooks } from "../../services/bookService";
import { getAllCategories } from "../../services/CategoryService";
import { Search } from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [booksByCategory, setBooksByCategory] = useState<Record<string, Book[]>>({});
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Filtros de la URL
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";

  // Cargar categorías al inicio
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      const categoryNames = data.map((c) => c.name);
      setCategories(categoryNames);
    };
    fetchCategories();
  }, []);

  // Efecto principal para cargar datos según filtros
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setSearchPerformed(false);

      try {
        // Si hay búsqueda activa
        if (searchQuery) {
          const results = await searchBooks(searchQuery);
          setSearchResults(results);
          setSearchPerformed(true);
          setRecommended([]);
          setBooksByCategory({});
          setLoading(false);
          return;
        }

        // Si no hay búsqueda, cargar normal
        setSearchResults(null);

        // Cargar todos los libros
        const allBooks = await getAllBooks();

        // Seleccionar 5 aleatorios como recomendados (solo si no hay categoría seleccionada)
        if (!category) {
          const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
          setRecommended(shuffled.slice(0, 5));
        } else {
          setRecommended([]);
        }

        // Cargar por categorías
        const data: Record<string, Book[]> = {};
        const categoriesToLoad = category ? [category] : categories;

        for (const cat of categoriesToLoad) {
          try {
            const books = await getBooksByCategory(cat);
            data[cat] = books;
          } catch (error) {
            console.error("Error cargando", cat, error);
            data[cat] = [];
          }
        }

        setBooksByCategory(data);
      } catch (error) {
        console.error("Error general cargando libros", error);
      } finally {
        setLoading(false);
      }
    }

    if (categories.length > 0 || searchQuery) {
      loadData();
    }
  }, [categories, category, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151515] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735CDB]"></div>
      </div>
    );
  }

  // Mostrar resultados de búsqueda
  if (searchPerformed && searchResults) {
    return (
      <div className="min-h-screen bg-[#151515] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Resultados de búsqueda
            </h1>
            <p className="text-gray-400">
              {searchResults.length} {searchResults.length === 1 ? 'libro encontrado' : 'libros encontrados'} para "{searchQuery}"
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  className="bg-gray-800/50 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/book/${book.id}`}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold truncate">{book.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{book.author}</p>
                    <p className="text-[#735CDB] font-bold mt-2">${book.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl">
              <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No se encontraron libros</p>
              <p className="text-gray-500">Intenta con otra palabra clave</p>
            </div>
          )}

          {/* Botón para limpiar búsqueda */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("search");
                window.location.href = `/?${params.toString()}`;
              }}
              className="px-6 py-2 bg-[#735CDB] text-white rounded-lg hover:bg-[#5f4ac7] transition"
            >
              Ver todos los libros
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar filtros activos
  const categoriesToShow = category ? [category] : categories;

  return (
    <div className="min-h-screen bg-[#151515]">
      {/* Filtros activos */}
      {(category || searchQuery) && (
        <div className="px-6 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 bg-gray-800/30 p-4 rounded-xl">
              <span className="text-gray-400">Filtros activos:</span>
              {category && (
                <span className="inline-flex items-center gap-2 bg-[#735CDB]/20 text-[#735CDB] px-3 py-1 rounded-full text-sm">
                  Categoría: {category}
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete("category");
                      window.location.href = `/?${params.toString()}`;
                    }}
                    className="hover:text-white text-lg"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-2 bg-[#735CDB]/20 text-[#735CDB] px-3 py-1 rounded-full text-sm">
                  Búsqueda: "{searchQuery}"
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete("search");
                      window.location.href = `/?${params.toString()}`;
                    }}
                    className="hover:text-white text-lg"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recomendados (solo si no hay filtros) */}
      {!category && !searchQuery && recommended.length > 0 && (
        <Carousel title="Recomendados para ti" books={recommended} />
      )}

      {/* Carruseles por categoría */}
      {categoriesToShow.map(
        (cat) =>
          booksByCategory[cat]?.length > 0 && (
            <Carousel
              key={cat}
              title={cat}
              books={booksByCategory[cat]}
            />
          )
      )}

      {/* Mensaje si no hay libros en categoría filtrada */}
      {category && booksByCategory[category]?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No hay libros disponibles en esta categoría</p>
        </div>
      )}
    </div>
  );
}