import api from "./api.js";

const loginEndpoint = import.meta.env.VITE_API_AUTH_PATH || "/auth/login";
const registerEndpoint =
  import.meta.env.VITE_API_REGISTER_PATH || "/auth/register";

export const loginUser = async ({ email, password }) => {
  const response = await api.post(loginEndpoint, {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async ({
  email,
  password,
  role,
  firstName,
  lastName,
  phone,
  city,
}) => {
  const response = await api.post(registerEndpoint, {
    fn: firstName,
    ln: lastName,
    firstName,
    lastName,
    email,
    password,
    phone,
    city,
    role,
  });

  return response.data;
};

export const checkProfileStatus = async (userId) => {
  const response = await api.get(`/auth/check-profile/${userId}`);
  return response.data;
};
