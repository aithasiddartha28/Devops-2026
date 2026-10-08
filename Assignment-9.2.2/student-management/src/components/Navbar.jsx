import { NavLink } from "react-router-dom";

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    marginRight: "20px",
    textDecoration: "none",
    color: isActive ? "red" : "blue",
    fontWeight: isActive ? "bold" : "normal"
  });

  return (
    <nav>
      <NavLink to="/" style={linkStyle}>
        Home
      </NavLink>

      <NavLink to="/students" style={linkStyle}>
        Students
      </NavLink>

      <NavLink to="/courses" style={linkStyle}>
        Courses
      </NavLink>

      <NavLink to="/about" style={linkStyle}>
        About
      </NavLink>
    </nav>
  );
}

export default Navbar;