# Service Provider Frontend

A React + Redux Toolkit frontend built with Vite for the SevaSaathi service provider platform. It integrates with the Spring Boot JWT backend and supports role-based flows for clients, service providers, and admins.

## Getting started

```bash
npm install
npm run dev
```

## Styling

This project uses Tailwind CSS for utility styles alongside the existing custom CSS classes. Tailwind directives are loaded in `src/index.css`.

## Environment

Create a `.env` file with your backend base URL:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_API_AUTH_PATH=/auth/login
VITE_API_REGISTER_PATH=/auth/register
VITE_API_USER_ME_PATH=/user/me
VITE_API_APPOINTMENTS_BOOK_PATH=/appointments/book
VITE_API_APPOINTMENTS_TASKS_PATH=/appointments/my-tasks
VITE_API_APPOINTMENTS_BOOKINGS_PATH=/appointments/my-bookings
VITE_API_APPOINTMENTS_STATUS_PATH=/appointments/status
VITE_API_REVIEWS_PROVIDER_PATH=/reviews/provider
```

## Routes

- `/` public landing page
- `/providers` browse service providers
- `/providers/:id` provider profile + reviews + booking
- `/login` / `/register` authentication
- `/complete-profile` profile setup wizard
- `/client` client dashboard
- `/provider` service provider dashboard
- `/admin` admin dashboard

## Authentication flow

- Login and register endpoints return `{ token, userId, email, role }`.
- Tokens are stored in `localStorage` and applied to every request.
- `401` responses clear the session and force logout.
- After login/register, the app calls `GET /auth/check-profile/{userId}` and redirects to profile completion if needed.
- Registration sends `fn`, `ln`, `phone`, and `city` (per `AuthRequest`) to avoid null user fields.

## API mapping

- Providers: `GET /sp/list`, `GET /sp/{id}`
- Reviews: `GET /reviews/provider/{providerId}`, `POST /reviews/submit`
- Profile: `POST /profile/setup`, `POST /sp/profile`
- Appointments: `POST /appointments/book`, `GET /appointments/my-tasks?status=`, `GET /appointments/my-bookings?status=`, `PATCH /appointments/status`
- Admin: `GET /admin/users`, `DELETE /admin/users/{id}`
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/check-profile/{userId}`
- Users: `GET /user/me`

## Structure

- `src/app` - Redux store configuration
- `src/features` - Feature slices (auth, etc.)
- `src/services` - API clients and service wrappers
- `src/pages` - Route-level pages
- `src/routes` - Protected routing helpers
