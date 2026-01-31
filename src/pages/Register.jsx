import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, clearAuthError } from "../features/auth/authSlice.js";
import {
  selectAuthError,
  selectAuthRole,
  selectAuthStatus,
  selectAuthUserId,
  selectIsAuthenticated,
} from "../features/auth/authSelectors.js";
import { checkProfileStatus } from "../services/authService.js";
import { getDashboardRoute } from "../routes/routeHelpers.js";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectAuthRole);
  const userId = useSelector(selectAuthUserId);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [selectedRole, setSelectedRole] = useState("ROLE_CLIENT");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const redirectAfterRegister = async () => {
      if (!isAuthenticated || !userId) {
        return;
      }
      try {
        const completed = await checkProfileStatus(userId);
        if (!completed) {
          navigate("/complete-profile", { replace: true });
          return;
        }
      } catch (errorResponse) {
        // fallback to dashboard
      }
      navigate(getDashboardRoute(role), { replace: true });
    };

    redirectAfterRegister();
  }, [isAuthenticated, userId, role, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());
    setLocalError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedPhone ||
      !trimmedCity ||
      !trimmedEmail
    ) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    try {
      await dispatch(
        register({
          email: trimmedEmail,
          password,
          role: selectedRole,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          phone: trimmedPhone,
          city: trimmedCity,
        })
      ).unwrap();
    } catch (registerError) {
      // Error handled in slice state.
    }
  };

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-2">Create account</h2>
        <p className="text-muted">Register as a client or service provider.</p>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              placeholder="City"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
            >
              <option value="ROLE_CLIENT">Client</option>
              <option value="ROLE_SERVICE_PROVIDER">Service Provider</option>
            </select>
          </div>
          <div className="col-12">
            {localError && <p className="text-danger mb-1">{localError}</p>}
            {error && <p className="text-danger mb-0">{error}</p>}
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
