import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuthRole,
  selectAuthUserId,
} from "../features/auth/authSelectors.js";
import { completeProfile, updateServiceProviderProfile } from "../services/profileService.js";
import { getDashboardRoute } from "../routes/routeHelpers.js";
import { fetchCurrentUser } from "../services/userService.js";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const role = useSelector(selectAuthRole);
  const userId = useSelector(selectAuthUserId);

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    aadhar: "",
    address: "",
    experienceYears: "",
    hourlyRate: "",
    skillsDescription: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchCurrentUser();
        setForm((prev) => ({
          ...prev,
          firstName: data.fn || data.firstName || prev.firstName,
          lastName: data.ln || data.lastName || prev.lastName,
          phone: data.phone || prev.phone,
          city: data.city || prev.city,
          address: data.address || prev.address,
          aadhar: data.aadhar || prev.aadhar,
        }));
      } catch (error) {
        // Ignore prefill failures.
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommonSubmit = async () => {
    await completeProfile({
      fn: form.firstName,
      ln: form.lastName,
      phone: form.phone,
      city: form.city,
      aadhar: form.aadhar,
      address: form.address,
      experienceYears: form.experienceYears || undefined,
      hourlyRate: form.hourlyRate || undefined,
      skillsDescription: form.skillsDescription || undefined,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await handleCommonSubmit();

      if (role === "ROLE_SERVICE_PROVIDER") {
        await updateServiceProviderProfile({
          experienceYears: Number(form.experienceYears),
          hourlyRate: Number(form.hourlyRate),
          skillsDescription: form.skillsDescription,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        });
      }

      setMessage("Profile completed successfully.");
      navigate(getDashboardRoute(role));
    } catch (error) {
      if (error.response?.status === 403) {
        setMessage(
          "Profile update forbidden (403). Confirm your backend allows this role to call /profile/setup and /sp/profile."
        );
        return;
      }
      setMessage(
        error.response?.data?.message ||
          "Unable to complete profile. Please try again."
      );
    } finally {
      setStatus("idle");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-2">Complete your profile</h2>
        <p className="text-muted">User ID: {userId || "—"}</p>
        <form className="row g-3" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="col-md-6">
                <label className="form-label">First name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Aadhar</label>
                <input
                  type="text"
                  name="aadhar"
                  className="form-control"
                  value={form.aadhar}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {role === "ROLE_SERVICE_PROVIDER" && step === 2 && (
            <>
              <div className="col-md-6">
                <label className="form-label">Experience years</label>
                <input
                  type="number"
                  name="experienceYears"
                  className="form-control"
                  value={form.experienceYears}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hourly rate</label>
                <input
                  type="number"
                  name="hourlyRate"
                  className="form-control"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Skills description</label>
                <textarea
                  name="skillsDescription"
                  className="form-control"
                  value={form.skillsDescription}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
            </>
          )}

          {role === "ROLE_SERVICE_PROVIDER" && step === 3 && (
            <>
              <div className="col-md-6">
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  className="form-control"
                  value={form.latitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  className="form-control"
                  value={form.longitude}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {message && <p className="text-muted mb-0">{message}</p>}

          <div className="col-12 d-flex gap-2">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={prevStep}
              >
                Back
              </button>
            )}
            {role === "ROLE_SERVICE_PROVIDER" && step < 3 && (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next
              </button>
            )}
            {role !== "ROLE_SERVICE_PROVIDER" && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Saving..." : "Finish"}
              </button>
            )}
            {role === "ROLE_SERVICE_PROVIDER" && step === 3 && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Saving..." : "Finish"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default CompleteProfile;
