import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import {
  selectAuthRole,
  selectIsAuthenticated,
} from "../features/auth/authSelectors.js";
import logo from "../assets/logo.svg";

const Layout = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectAuthRole);

  return (
    <div className="app-shell bg-light min-vh-100">
      <header className="navbar navbar-dark bg-primary">
        <div className="container-fluid flex-wrap gap-3">
          <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src={logo} alt="SevaSaathi logo" className="brand-logo" />
            <div>
              <span className="fw-bold">SevaSaathi</span>
              <div className="small text-white-50">
                Find trusted service providers near you
              </div>
            </div>
          </NavLink>
          <nav className="navbar-nav flex-row flex-wrap ms-auto gap-2 align-items-center">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/providers"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              Providers
            </NavLink>
            {role === "ROLE_CLIENT" && (
              <NavLink
                to="/client"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Client
              </NavLink>
            )}
            {role === "ROLE_SERVICE_PROVIDER" && (
              <NavLink
                to="/provider"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Provider
              </NavLink>
            )}
            {role === "ROLE_ADMIN" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Admin
              </NavLink>
            )}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `btn btn-outline-light btn-sm${isActive ? " active" : ""}`
              }
            >
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-light btn-sm">
              Register
            </NavLink>
            {isAuthenticated && (
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={() => dispatch(logout())}
              >
                Log out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
