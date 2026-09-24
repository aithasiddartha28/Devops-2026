import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const books = [
  {
    id: 101,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
    description: "A story about following your dreams and discovering your purpose.",
  },
  {
    id: 102,
    title: "Atomic Habits",
    author: "James Clear",
    price: 399,
    description: "A practical guide to building good habits and breaking bad ones.",
  },
  {
    id: 103,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 499,
    description: "A guide to writing readable, maintainable, and professional code.",
  },
];

function BookDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setBook(null);

    const timer = setTimeout(() => {
      const selectedBook = books.find(
        (book) => book.id === Number(id)
      );

      setBook(selectedBook || null);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      console.log("Cleanup: BookDetails effect");
    };
  }, [id]);

  if (loading) {
    return (
      <section className="page">
        <h2>Loading book details...</h2>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="page">
        <h1>Book Not Found</h1>
        <p>The requested book does not exist.</p>

        <button onClick={() => navigate("/books")}>
          Back to Books
        </button>
      </section>
    );
  }

  return (
    <section className="page book-details">
      <button onClick={() => navigate(-1)}>
        Go Back
      </button>

      <h1>{book.title}</h1>

      <p>
        <strong>Author:</strong> {book.author}
      </p>

      <p>
        <strong>Price:</strong> ₹{book.price}
      </p>

      <p>{book.description}</p>

      <button onClick={() => onAddToCart(book)}>
        Add to Cart
      </button>
    </section>
  );
}

export default BookDetails;