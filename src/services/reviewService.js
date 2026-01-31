import api from "./api.js";

const reviewsEndpoint =
  import.meta.env.VITE_API_REVIEWS_PROVIDER_PATH || "/reviews/provider";

export const fetchReviewsForProvider = async (providerId) => {
  const response = await api.get(`${reviewsEndpoint}/${providerId}`);
  return response.data;
};

export const submitReview = async (payload) => {
  const response = await api.post("/reviews/submit", payload);
  return response.data;
};
