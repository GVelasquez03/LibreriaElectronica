import type { Book } from "../../types/book";
import BookCard from "../BookCard/BookCard";

interface Props {
  books: Book[];
  isAdmin?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (id: number) => void;
}

export default function BookGrid({ books,isAdmin = false,onEdit,onDelete,}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
