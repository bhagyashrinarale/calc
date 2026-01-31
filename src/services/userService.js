import api from "./api.js";

const currentUserEndpoint =
  import.meta.env.VITE_API_USER_ME_PATH || "/user/me";

export const fetchCurrentUser = async () => {
  const response = await api.get(currentUserEndpoint);
  return response.data;
};
