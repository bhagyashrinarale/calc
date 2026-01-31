import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import {
  getProviderDisplayName,
  getProviderId,
} from "../utils/provider.js";

const ProviderCard = ({ provider }) => {
  const providerId = getProviderId(provider);
  const name = getProviderDisplayName(provider);
  const rating = provider.rating ?? provider.averageRating ?? "—";
  const hourlyRate = provider.hourlyRate ?? "N/A";
  const experienceYears = provider.experienceYears ?? "N/A";

  return (
    <article className="card provider-card shadow-sm h-100">
      <div className="card-body d-flex flex-column gap-3">
        <div className="d-flex align-items-center gap-3">
          <img src={logo} alt="" className="provider-logo" />
          <div>
            <h3 className="h5 mb-1">{name}</h3>
            <div className="text-muted small">Verified provider</div>
          </div>
        </div>
        <div className="rating d-flex align-items-center gap-2">
          <span className="badge text-bg-warning">★ {rating}</span>
          <span className="text-muted small">Top rated</span>
        </div>
        <div className="provider-meta d-flex flex-column gap-1">
          <span>Rate: {hourlyRate}</span>
          <span>Experience: {experienceYears} yrs</span>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pt-0">
      {providerId ? (
        <Link className="btn btn-primary w-100" to={`/providers/${providerId}`}>
          View profile
        </Link>
      ) : (
        <span className="btn btn-secondary w-100 disabled" aria-disabled="true">
          Profile unavailable
        </span>
      )}
      </div>
    </article>
  );
};

ProviderCard.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    providerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    spId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    profile_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    fullName: PropTypes.string,
    providerName: PropTypes.string,
    email: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hourlyRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    experienceYears: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default ProviderCard;
