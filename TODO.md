# Role-Based Access Control Implementation

## Completed Tasks
- [x] Update AuthContext.tsx signIn method to fetch profile and redirect user to their dashboard based on role after successful signin
- [x] Add role-based redirect logic in App.tsx or create a PrivateRoute component to prevent unauthorized access to dashboards
- [x] Ensure Dashboard.tsx remains as is for rendering correct dashboard based on role
- [x] Add loading or redirect state during signin to avoid flicker
- [x] Test role-based access for all user types (admin, reviewer, applicant)
- [x] Handle edge cases like users without roles or authentication failures
- [x] Test the implementation by running the application and verifying role-based redirects
