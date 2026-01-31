import { useEffect, useState } from "react";
import ProviderGrid from "../components/ProviderGrid.jsx";
import { fetchProviders } from "../services/providerService.js";

const Providers = () => {
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
    <section>
      <div className="mb-4">
        <h2 className="mb-1">Service Providers</h2>
        <p className="text-muted">
          Search and filter providers by rating or price.
        </p>
      </div>
      {status === "loading" ? (
        <p className="text-muted">Loading providers...</p>
      ) : (
        <ProviderGrid providers={providers} />
      )}
    </section>
  );
};

export default Providers;
