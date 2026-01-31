import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProviderGrid from "../components/ProviderGrid.jsx";
import { fetchProviders } from "../services/providerService.js";
import { fetchClientBookings } from "../services/appointmentService.js";
import { submitReview } from "../services/reviewService.js";
import { completeProfile } from "../services/profileService.js";
import { fetchCurrentUser } from "../services/userService.js";

const ClientDashboard = () => {
  const [providers, setProviders] = useState([]);
  const [providerLookup, setProviderLookup] = useState({});
  const [status, setStatus] = useState("loading");
  const [bookings, setBookings] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("loading");
  const [bookingFilter, setBookingFilter] = useState("");
  const [reviewForm, setReviewForm] = useState({
    appointmentId: "",
    serviceProviderId: "",
    rating: "",
    comment: "",
  });
  const [selectedProviderName, setSelectedProviderName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewStatus, setReviewStatus] = useState("idle");
  const [identity, setIdentity] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    aadhar: "",
    address: "",
  });
  const [identityMessage, setIdentityMessage] = useState("");
  const [profileFetchMessage, setProfileFetchMessage] = useState("");

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await fetchProviders();
        const normalized = Array.isArray(data) ? data : [];
        setProviders(normalized);
        const lookup = normalized.reduce((accumulator, provider) => {
          const providerId =
            provider.id ??
            provider.userId ??
            provider.providerId ??
            provider.spId ??
            provider.profileId ??
            provider.profile_id;
          const rawName =
            provider.name ||
            provider.fullName ||
            provider.providerName ||
            [provider.firstName, provider.lastName].filter(Boolean).join(" ") ||
            "";
          const normalizedName =
            rawName && !rawName.toLowerCase().includes("null") ? rawName : "";
          const name =
            normalizedName || provider.email || "Service Provider";
          if (providerId) {
            accumulator[providerId] = name;
          }
          return accumulator;
        }, {});
        setProviderLookup(lookup);
      } catch (error) {
        setProviders([]);
      } finally {
        setStatus("idle");
      }
    };

    loadProviders();
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchClientBookings(bookingFilter || undefined);
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        setBookings([]);
      } finally {
        setBookingStatus("idle");
      }
    };

    loadBookings();
  }, [bookingFilter]);

  useEffect(() => {
    const loadIdentity = async () => {
      try {
        const data = await fetchCurrentUser();
        setIdentity((prev) => ({
          ...prev,
          firstName: data.fn || data.firstName || prev.firstName,
          lastName: data.ln || data.lastName || prev.lastName,
          phone: data.phone || prev.phone,
          city: data.city || prev.city,
          aadhar: data.aadhar || prev.aadhar,
          address: data.address || prev.address,
        }));
      } catch (error) {
        setProfileFetchMessage(
          error.response?.status === 403
            ? "Unable to load profile (403). Check backend permissions for /user/me."
            : "Unable to load profile details."
        );
      }
    };

    loadIdentity();
  }, []);

  const handlePopulateReview = (booking) => {
    const providerId =
      booking.serviceProviderId ||
      booking.service_provider_id ||
      booking.serviceProviderProfileId ||
      booking.service_provider_profile_id ||
      booking.providerId ||
      booking.provider_id;
    const providerName =
      booking.providerName ||
      booking.serviceProviderName ||
      providerLookup[providerId] ||
      "Provider info unavailable";
    setReviewForm((prev) => ({
      ...prev,
      appointmentId: booking.appointmentId || booking.appointment_id || booking.id,
      serviceProviderId: providerId || "",
    }));
    setSelectedProviderName(providerName);
  };

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewStatus("loading");
    setReviewMessage("");
    try {
      await submitReview({
        appointmentId: Number(reviewForm.appointmentId),
        serviceProviderId: Number(reviewForm.serviceProviderId),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewMessage("Review submitted successfully.");
      setReviewForm({
        appointmentId: "",
        serviceProviderId: "",
        rating: "",
        comment: "",
      });
    } catch (error) {
      setReviewMessage(
        error.response?.data?.message || "Unable to submit review."
      );
    } finally {
      setReviewStatus("idle");
    }
  };

  const handleIdentityChange = (event) => {
    const { name, value } = event.target;
    setIdentity((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdentitySubmit = async (event) => {
    event.preventDefault();
    setIdentityMessage("");
    try {
      await completeProfile({
        fn: identity.firstName,
        ln: identity.lastName,
        phone: identity.phone,
        city: identity.city,
        aadhar: identity.aadhar,
        address: identity.address,
      });
      setIdentityMessage("Basic profile updated.");
    } catch (error) {
      if (error.response?.status === 403) {
        setIdentityMessage(
          "Profile update forbidden (403). Check backend authority for /profile/setup."
        );
        return;
      }
      setIdentityMessage(
        error.response?.data?.message || "Unable to update basic profile."
      );
    }
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="mb-1">Client Dashboard</h2>
          <p className="text-muted">Browse providers and book appointments.</p>
          {profileFetchMessage && (
            <p className="text-muted">{profileFetchMessage}</p>
          )}
        </div>
        <Link className="btn btn-primary" to="/providers">
          Browse all
        </Link>
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <h3 className="h5 mb-0">My appointments</h3>
            <div>
              <label className="form-label mb-1">Filter by status</label>
              <select
                className="form-select"
                value={bookingFilter}
                onChange={(event) => setBookingFilter(event.target.value)}
              >
                <option value="">All</option>
                <option value="PENDING">PENDING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
        {bookingStatus === "loading" ? (
          <p className="text-muted">Loading appointments...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted">No appointments yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Appointment</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end">Review</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const appointmentId =
                    booking.appointmentId || booking.appointment_id || booking.id;
                  const providerId =
                    booking.serviceProviderId ||
                    booking.service_provider_id ||
                    booking.serviceProviderProfileId ||
                    booking.service_provider_profile_id;
                  const providerName =
                    booking.providerName ||
                    booking.serviceProviderName ||
                    providerLookup[providerId] ||
                    "Provider info unavailable";
                  return (
                    <tr key={appointmentId}>
                      <td>#{appointmentId}</td>
                      <td>{providerName}</td>
                      <td>
                        {booking.dateTime || booking.date_time_requested || "—"}
                      </td>
                      <td>{booking.status}</td>
                      <td className="text-end">
                        {booking.status === "COMPLETED" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handlePopulateReview(booking)}
                          >
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="h5 mb-2">Submit a review</h3>
          <p className="text-muted">
            Select a completed appointment above to prefill the review, or enter
            the appointment and provider IDs manually.
          </p>
          <form className="row g-3" onSubmit={handleReviewSubmit}>
            <div className="col-md-6">
              <label className="form-label">Appointment ID</label>
              <input
                type="number"
                name="appointmentId"
                className="form-control"
                value={reviewForm.appointmentId}
                onChange={handleReviewChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Service Provider ID</label>
              <input
                type="number"
                name="serviceProviderId"
                className="form-control"
                value={reviewForm.serviceProviderId}
                onChange={handleReviewChange}
                required
              />
              <span className="text-muted small">
                {selectedProviderName ||
                  providerLookup[reviewForm.serviceProviderId] ||
                  "Provider name will appear here once selected."}
              </span>
            </div>
            <div className="col-md-4">
              <label className="form-label">Rating</label>
              <input
                type="number"
                name="rating"
                className="form-control"
                min="1"
                max="5"
                value={reviewForm.rating}
                onChange={handleReviewChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Comment</label>
              <textarea
                name="comment"
                className="form-control"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                rows="3"
                required
              />
            </div>
            {reviewMessage && <p className="text-muted mb-0">{reviewMessage}</p>}
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={reviewStatus === "loading"}
              >
                {reviewStatus === "loading" ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="h5 mb-2">Update basic details</h3>
          <form className="row g-3" onSubmit={handleIdentitySubmit}>
            <div className="col-md-6">
              <label className="form-label">First name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                value={identity.firstName}
                onChange={handleIdentityChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                value={identity.lastName}
                onChange={handleIdentityChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={identity.phone}
                onChange={handleIdentityChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={identity.city}
                onChange={handleIdentityChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Aadhar</label>
              <input
                type="text"
                name="aadhar"
                className="form-control"
                value={identity.aadhar}
                onChange={handleIdentityChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={identity.address}
                onChange={handleIdentityChange}
                required
              />
            </div>
            {identityMessage && (
              <p className="text-muted mb-0">{identityMessage}</p>
            )}
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Save basic details
              </button>
            </div>
          </form>
        </div>
      </div>
      {status === "loading" ? (
        <p className="text-muted">Loading providers...</p>
      ) : (
        <ProviderGrid providers={providers} />
      )}
    </section>
  );
};

export default ClientDashboard;
