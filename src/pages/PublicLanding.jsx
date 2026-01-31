import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProviderGrid from "../components/ProviderGrid.jsx";
import { fetchProviders } from "../services/providerService.js";

const PublicLanding = () => {
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await fetchProviders();
        setProviders(Array.isArray(data) ? data : []);
      } catch (error) {
        setProviders([]);
      } finally {
        setStatus("idle");
      }
    };

    loadProviders();
  }, []);

  return (
    <section className="landing">
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="mb-2">
            SevaSaathi: Find trusted service providers near you
          </h2>
          <p className="text-muted">
            Discover verified professionals, read reviews, and book appointments
            instantly.
          </p>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Link className="btn btn-primary" to="/providers">
              Explore providers
            </Link>
            <Link className="btn btn-outline-primary" to="/register">
              Create account
            </Link>
          </div>
          <div className="row g-3 text-center">
            <div className="col-12 col-md-4">
              <div className="p-3 border rounded-3 bg-light">
                <p className="text-muted mb-1">Verified providers</p>
                <strong>500+</strong>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 border rounded-3 bg-light">
                <p className="text-muted mb-1">Appointments completed</p>
                <strong>12k+</strong>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 border rounded-3 bg-light">
                <p className="text-muted mb-1">Average rating</p>
                <strong>4.8 ★</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Featured providers</h3>
        <Link to="/providers" className="btn btn-link">
          View all
        </Link>
      </div>
      {status === "loading" ? (
        <p className="text-muted">Loading providers...</p>
      ) : (
        <ProviderGrid providers={providers.slice(0, 6)} />
      )}
    </section>
  );
};

export default PublicLanding;
