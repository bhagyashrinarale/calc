export const selectAuth = (state) => state.auth;

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export const selectAuthStatus = (state) => state.auth.status;

export const selectAuthError = (state) => state.auth.error;

export const selectAuthRole = (state) => state.auth.role;

export const selectAuthUserId = (state) => state.auth.userId;
