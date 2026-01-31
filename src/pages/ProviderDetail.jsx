import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchProviderById } from "../services/providerService.js";
import { fetchReviewsForProvider } from "../services/reviewService.js";
import { bookAppointment } from "../services/appointmentService.js";
import {
  selectAuthRole,
  selectIsAuthenticated,
} from "../features/auth/authSelectors.js";
import { getProviderDisplayName } from "../utils/provider.js";

const ProviderDetail = () => {
  const { id } = useParams();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectAuthRole);
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reviewError, setReviewError] = useState("");
  const [bookingStatus, setBookingStatus] = useState("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const [form, setForm] = useState({
    dateTime: "",
    description: "",
    clientLocation: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const providerData = await fetchProviderById(id);
        setProvider(providerData);
      } catch (error) {
        setProvider(null);
      }

      try {
        const reviewData = await fetchReviewsForProvider(id);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (error) {
        if (error.response?.status === 403) {
          setReviewError("Login to view provider reviews.");
        } else {
          setReviewError("Unable to load reviews.");
        }
      } finally {
        setStatus("idle");
      }
    };

    load();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBook = async (event) => {
    event.preventDefault();
    setBookingStatus("loading");
    setBookingMessage("");
    try {
      await bookAppointment({
        serviceProviderId: Number(id),
        dateTime: form.dateTime,
        description: form.description,
        clientLocation: form.clientLocation,
      });
      setBookingMessage("Appointment request submitted.");
      setForm({ dateTime: "", description: "", clientLocation: "" });
    } catch (error) {
      setBookingMessage(
        error.response?.data?.message || "Unable to book appointment."
      );
    } finally {
      setBookingStatus("idle");
    }
  };

  if (status === "loading") {
    return <p className="text-muted">Loading provider...</p>;
  }

  if (!provider) {
    return <p className="text-muted">Provider not found.</p>;
  }

  const name = getProviderDisplayName(provider);

  return (
    <section className="provider-detail">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="mb-2">{name}</h2>
          <p className="text-muted">{provider.skillsDescription || ""}</p>
          <div className="d-flex flex-wrap gap-3">
            <span>Rating: {provider.rating ?? "—"}</span>
            <span>Hourly rate: {provider.hourlyRate ?? "N/A"}</span>
            <span>Experience: {provider.experienceYears ?? "N/A"} yrs</span>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Reviews</h3>
          {reviewError ? (
            <p className="text-muted">{reviewError}</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted">No reviews yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {reviews.map((review) => (
                <li className="list-group-item" key={review.id}>
                  <strong>{review.rating ?? "—"}★</strong> {review.comment}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3">Book appointment</h3>
          {!isAuthenticated && (
            <p className="text-muted">
              Please <Link to="/login">login</Link> to book an appointment.
            </p>
          )}
          {isAuthenticated && role !== "ROLE_CLIENT" && (
            <p className="text-muted">
              Only client accounts can book appointments.
            </p>
          )}
          {isAuthenticated && role === "ROLE_CLIENT" && (
            <form className="row g-3" onSubmit={handleBook}>
              <div className="col-md-6">
                <label className="form-label">Date & time</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  className="form-control"
                  value={form.dateTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="clientLocation"
                  className="form-control"
                  value={form.clientLocation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              {bookingMessage && (
                <p className="text-muted mb-0">{bookingMessage}</p>
              )}
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bookingStatus === "loading"}
                >
                  {bookingStatus === "loading"
                    ? "Booking..."
                    : "Book appointment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProviderDetail;
