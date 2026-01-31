import api from "./api.js";

export const completeProfile = async (payload) => {
  const response = await api.post("/profile/setup", payload);
  return response.data;
};

export const updateServiceProviderProfile = async (payload) => {
  const response = await api.post("/sp/profile", payload);
  return response.data;
};
