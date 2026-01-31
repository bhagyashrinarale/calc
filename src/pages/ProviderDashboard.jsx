import { useEffect, useState } from "react";
import {
  fetchProviderTasks,
  updateAppointmentStatus,
} from "../services/appointmentService.js";
import {
  completeProfile,
  updateServiceProviderProfile,
} from "../services/profileService.js";
import { fetchCurrentUser } from "../services/userService.js";

const statuses = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"];

const normalizeTask = (task) => ({
  appointmentId:
    task.appointmentId || task.appointment_id || task.id || task.appointmentID,
  dateTime:
    task.dateTime ||
    task.date_time_requested ||
    task.dateTimeRequested ||
    task.dateTimeRequestedAt,
  status: task.status,
});

const ProviderDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [profile, setProfile] = useState({
    experienceYears: "",
    hourlyRate: "",
    skillsDescription: "",
    latitude: "",
    longitude: "",
  });
  const [profileMessage, setProfileMessage] = useState("");
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
    const loadTasks = async () => {
      try {
        const data = await fetchProviderTasks(filterStatus || undefined);
        const normalized = Array.isArray(data)
          ? data.map((task) => ({ ...task, ...normalizeTask(task) }))
          : [];
        setTasks(normalized);
      } catch (error) {
        setTasks([]);
      } finally {
        setStatus("idle");
      }
    };

    loadTasks();
  }, [filterStatus]);

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

  const handleStatusChange = async (appointmentId, newStatus) => {
    setMessage("");
    try {
      await updateAppointmentStatus({ appointmentId, status: newStatus });
      setTasks((prev) =>
        prev.map((task) =>
          task.appointmentId === appointmentId
            ? { ...task, status: newStatus }
            : task
        )
      );
      setMessage("Status updated.");
    } catch (error) {
      if (error.response?.status === 403) {
        setMessage(
          "Status update forbidden (403). Confirm the service provider role has access to /appointments/status."
        );
        return;
      }
      setMessage(error.response?.data?.message || "Unable to update status.");
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdentityChange = (event) => {
    const { name, value } = event.target;
    setIdentity((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage("");
    try {
      await updateServiceProviderProfile({
        experienceYears: Number(profile.experienceYears),
        hourlyRate: Number(profile.hourlyRate),
        skillsDescription: profile.skillsDescription,
        latitude: Number(profile.latitude),
        longitude: Number(profile.longitude),
      });
      setProfileMessage("Profile updated.");
    } catch (error) {
      if (error.response?.status === 403) {
        setProfileMessage(
          "Profile update forbidden (403). Check backend authority for /sp/profile (ROLE_SERVICE_PROVIDER vs SERVICE_PROVIDER)."
        );
        return;
      }
      setProfileMessage(
        error.response?.data?.message || "Unable to update profile."
      );
    }
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
    <section className="provider-dashboard">
      <div className="mb-4">
        <h2 className="mb-1">Service Provider Dashboard</h2>
        <p className="text-muted">Manage your tasks and profile.</p>
        {profileFetchMessage && (
          <p className="text-muted">{profileFetchMessage}</p>
        )}
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <h3 className="h5 mb-0">My Tasks</h3>
            <div>
              <label className="form-label mb-1">Filter by status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
              >
                <option value="">All</option>
                {statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {status === "loading" ? (
            <p className="text-muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-muted">No tasks assigned yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Appointment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.appointmentId}>
                      <td>#{task.appointmentId}</td>
                      <td>{task.dateTime || "—"}</td>
                      <td>{task.status}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={task.status}
                          onChange={(event) =>
                            handleStatusChange(
                              task.appointmentId,
                              event.target.value
                            )
                          }
                        >
                          {statuses.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {message && <p className="text-muted">{message}</p>}
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="h5 mb-2">Update profile</h3>
          <form className="row g-3" onSubmit={handleProfileSubmit}>
            <div className="col-md-6">
              <label className="form-label">Experience years</label>
              <input
                type="number"
                name="experienceYears"
                className="form-control"
                value={profile.experienceYears}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Hourly rate</label>
              <input
                type="number"
                name="hourlyRate"
                className="form-control"
                value={profile.hourlyRate}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Skills description</label>
              <textarea
                name="skillsDescription"
                className="form-control"
                value={profile.skillsDescription}
                onChange={handleProfileChange}
                rows="3"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                name="latitude"
                className="form-control"
                value={profile.latitude}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                name="longitude"
                className="form-control"
                value={profile.longitude}
                onChange={handleProfileChange}
                required
              />
            </div>
            {profileMessage && (
              <p className="text-muted mb-0">{profileMessage}</p>
            )}
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Save profile
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
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
    </section>
  );
};

export default ProviderDashboard;
