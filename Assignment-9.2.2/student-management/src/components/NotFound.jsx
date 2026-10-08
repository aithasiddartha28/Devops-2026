import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>404 - Page Not Found</h2>

      <p>The page you are looking for does not exist.</p>

      <button onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}

export default NotFound;