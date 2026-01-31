import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="card shadow-sm">
    <div className="card-body">
      <h2 className="h4 mb-2">Page not found</h2>
      <p className="text-muted">
        The page you are looking for does not exist. Return to the dashboard or
        login screen.
      </p>
      <Link className="btn btn-primary" to="/">
        Go to login
      </Link>
    </div>
  </section>
);

export default NotFound;
