import { NavLink } from "react-router-dom";

function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📚 Book Store
      </div>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/cart">Cart ({cartCount})</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;