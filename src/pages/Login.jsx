import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login, clearAuthError } from "../features/auth/authSlice.js";
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectAuthRole,
  selectAuthUserId,
} from "../features/auth/authSelectors.js";
import { checkProfileStatus } from "../services/authService.js";
import { getDashboardRoute } from "../routes/routeHelpers.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectAuthRole);
  const userId = useSelector(selectAuthUserId);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileStatus, setProfileStatus] = useState(null);

  useEffect(() => {
    const redirectAfterLogin = async () => {
      if (!isAuthenticated || !userId) {
        return;
      }
      try {
        const completed = await checkProfileStatus(userId);
        setProfileStatus(completed);
        if (!completed) {
          navigate("/complete-profile", { replace: true });
          return;
        }
        navigate(getDashboardRoute(role), { replace: true });
      } catch (errorResponse) {
        navigate(getDashboardRoute(role), { replace: true });
      }
    };

    redirectAfterLogin();
  }, [isAuthenticated, userId, role, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());

    try {
      await dispatch(login({ email, password })).unwrap();
      const redirectPath = location.state?.from?.pathname;
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    } catch (loginError) {
      // Error handled in slice state.
    }
  };

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-2">Sign in</h2>
        <p className="text-muted">
        Use your credentials to access the portal. New here? Register for a
        client or service provider account.
        </p>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
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
          <div className="col-12">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger mb-0">{error}</p>}
          {profileStatus === false && (
            <p className="text-muted mb-0">Complete your profile to continue.</p>
          )}
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
