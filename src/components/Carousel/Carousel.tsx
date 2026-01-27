import { useEffect, useRef, useState } from "react";
import type { Book } from "../../types/book";
import BookCard from "../BookCard/BookCard";
import "./carousel.css";

interface Props {
  books: Book[];
  title: string;
  speed?: number; // píxeles por frame aproximados
}

export default function Carousel({ books, title, speed = 0.6 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  // Sincroniza el ref con el estado
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Solo duplicamos si hay suficientes items para evitar repetición evidente
  const shouldDuplicate = books.length >= 5; // ajusta este umbral si quieres
  const items = shouldDuplicate ? [...books, ...books] : books;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const animate = () => {
      if (!isPausedRef.current) {
        el.scrollLeft += speed;

        if (shouldDuplicate) {
          // cuando duplicamos, usamos la mitad del scrollWidth para loop perfecto
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = el.scrollLeft - el.scrollWidth / 2;
          }
        } else {
          // sin duplicar: cuando llegamos al final volvemos al inicio (salto)
          // esto evita mostrar dos copias seguidas cuando la lista es pequeña
          if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
            el.scrollLeft = 0;
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [speed, shouldDuplicate]);

 const scrollRight = () => {
   const el = containerRef.current;
   if (!el) return;

   setIsPaused(true);
   el.scrollBy({ left: 300, behavior: "smooth" });
   setTimeout(() => setIsPaused(false), 700);
 };

 const scrollLeft = () => {
   const el = containerRef.current;
   if (!el) return;

   setIsPaused(true);
   el.scrollBy({ left: -300, behavior: "smooth" });
   setTimeout(() => setIsPaused(false), 700);
 };


  return (
    <section className="carousel-root">
      <h2 className="carousel-title">{title}</h2>

      <button
        className="carousel-btn left"
        onClick={scrollLeft}
        aria-label="scroll left"
      >
        ◀
      </button>

      <button
        className="carousel-btn right"
        onClick={scrollRight}
        aria-label="scroll right"
      >
        ▶
      </button>

      <div
        ref={containerRef}
        className="carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {items.map((book, index) => (
          <div key={`${book.id}-${index}`} className="carousel-item">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
