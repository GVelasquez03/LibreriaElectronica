import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Book } from "../../types/book";
import { getBookById } from "../../services/bookService";
import "../../style/BookDetail.css";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      try {
        const data = await getBookById(Number(id));
        setBook(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  if (loading) {
    return <h2 style={{ color: "white" }}>Cargando libro...</h2>;
  }

  if (!book) {
    return <h2 style={{ color: "white" }}>Libro no encontrado</h2>;
  }

  return (
    <div className="book-detail-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Volver
      </button>

      <div className="book-detail-content">
        <div className="book-cover">
          <img src={book.cover} alt={book.title} />
        </div>

        <div className="book-info">
          <h1>{book.title}</h1>
          <h3>{book.author}</h3>
          <p className="description">{book.description}</p>
          <p className="price">${book.price}</p>
          <button className="add-to-cart">Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}
