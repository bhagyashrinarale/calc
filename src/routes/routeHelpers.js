export const getDashboardRoute = (role) => {
  switch (role) {
    case "ROLE_ADMIN":
      return "/admin";
    case "ROLE_SERVICE_PROVIDER":
      return "/provider";
    case "ROLE_CLIENT":
      return "/client";
    default:
      return "/";
  }
};
