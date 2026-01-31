import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import ProviderCard from "./ProviderCard.jsx";
import { getProviderId } from "../utils/provider.js";

const ProviderGrid = ({ providers }) => {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRate, setMaxRate] = useState(1000);

  const filtered = useMemo(() => {
    return providers.filter((provider) => {
      const name =
        provider.name ||
        provider.fullName ||
        provider.providerName ||
        provider.email ||
        "";
      const rating = Number(provider.rating ?? 0);
      const hourlyRate = Number(provider.hourlyRate ?? 0);

      return (
        name.toLowerCase().includes(search.toLowerCase()) &&
        rating >= minRating &&
        hourlyRate <= maxRate
      );
    });
  }, [providers, search, minRating, maxRate]);

  return (
    <section className="provider-grid-section">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label">Search</label>
              <input
                type="search"
                className="form-control"
                placeholder="Search providers"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label">Min rating</label>
              <input
                type="number"
                className="form-control"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(event) => setMinRating(Number(event.target.value))}
              />
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label">Max hourly rate</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="10"
                value={maxRate}
                onChange={(event) => setMaxRate(Number(event.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted">No providers match your filters.</p>
      ) : (
        <div className="row g-4">
          {filtered.map((provider, index) => {
            const providerKey =
              getProviderId(provider) ||
              provider.email ||
              provider.name ||
              provider.providerName ||
              index;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={providerKey}>
                <ProviderCard provider={provider} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

ProviderGrid.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProviderGrid;
