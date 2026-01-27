import { Link } from "react-router-dom";
import type { Book } from "../../types/book";

interface Props {
  book: Book;
  isAdmin?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (id: number) => void;
}

export default function BookCard({
  book,
  isAdmin = false,
  onEdit,
  onDelete,
}: Props) {
  const Card = (
    <div className="
      relative w-[180px]
      transition-transform duration-200
      group
      cursor-pointer
      hover:scale-105
    ">
      {/* BOTONES ADMIN */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            onClick={() => onEdit?.(book)}
            className="
              bg-black/60 border border-amber-400
              text-amber-400
              rounded-md px-2 py-1
              hover:bg-amber-400 hover:text-black
              transition
            "
            title="Editar"
          >
            ✏️
          </button>

          <button
            onClick={() => onDelete?.(book.id)}
            className="
              bg-black/60 border border-red-500
              text-red-500
              rounded-md px-2 py-1
              hover:bg-red-500 hover:text-white
              transition
            "
            title="Eliminar"
          >
            🗑
          </button>
        </div>
      )}

      {/* IMAGEN */}
      <img
        src={book.cover}
        alt={book.title}
        loading="lazy"
        className="
          w-full h-[260px]
          object-cover
          rounded-md
        "
      />

      {/* TITULO */}
      <p className="mt-2 text-sm text-white font-normal">
        {book.title}
      </p>
    </div>
  );

  // 🟢 PUBLICO → LINK
  if (!isAdmin) {
    return (
      <Link to={`/book/${book.id}`} className="no-underline">
        {Card}
      </Link>
    );
  }

  // 🔴 ADMIN → SIN LINK
  return Card;
}
