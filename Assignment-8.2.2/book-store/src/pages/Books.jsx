import { Link } from "react-router-dom";

const books = [
  {
    id: 101,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
  },
  {
    id: 102,
    title: "Atomic Habits",
    author: "James Clear",
    price: 399,
  },
  {
    id: 103,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 499,
  },
];

function Books() {
  return (
    <section className="page">
      <h1>Books</h1>

      <div className="book-grid">
        {books.map((book) => (
          <div className="book-card" key={book.id}>
            <h2>{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>Price: ₹{book.price}</p>

            {/* ADD THE LINK HERE */}
            <Link to={`/books/${book.id}`}>
              View Details
            </Link>

          </div>
        ))}
      </div>
    </section>
  );
}

export default Books;