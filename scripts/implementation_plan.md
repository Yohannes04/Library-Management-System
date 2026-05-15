# Member Login Functionality Implementation Plan

This plan outlines the steps and code structure to implement the Member Login functionality for the Library Management System based on your Module 2 specifications.

## Background Context
We need to implement the backend logic, database interaction layers, and frontend components for the Member Login functionality. The database follows a Base-Extension model where the `Users` table stores credentials and `Members` stores member-specific data (`MaxBooksAllowed`, etc.). The backend is currently using Express.js + MySQL, and the frontend is a React + Vite app.

## Proposed Changes

### Backend Setup (Node.js/Express)
We will install necessary dependencies: `bcryptjs` (for password hashing) and `jsonwebtoken` (for session-based authentication).

---

#### [NEW] [AuthMiddleware.js](file:///c:/Users/hp/Desktop/Book/Library%20Management%20System/backend/src/middleware/AuthMiddleware.js)
This file will contain the middleware to:
- Extract and verify the JWT from the `Authorization` header.
- Ensure the authenticated user has the 'Member' role (or the specific RoleID that maps to 'Member' in your DB).

#### [NEW] [MemberModel.js](file:///c:/Users/hp/Desktop/Book/Library%20Management%20System/backend/src/models/MemberModel.js)
The data access layer handling the database queries:
- Query `Users` by email to fetch the user credentials.
- Handle a `JOIN` between `Users`, `Members`, and `Roles` to fetch `MaxBooksAllowed` and `RoleName` after successful validation.

#### [NEW] [AuthController.js](file:///c:/Users/hp/Desktop/Book/Library%20Management%20System/backend/src/controllers/AuthController.js)
The controller will handle the login request following the specified 8-step flow:
1. Accept email and password from the request body.
2. Call `MemberModel` to get the user by email.
3. If not found, return generic "Invalid credentials".
4. If found, verify the password using `bcrypt`. Return "Invalid credentials" on failure.
5. Check `Status`. If 'Suspended' or 'Inactive', return "Account is not active".
6. Call `MemberModel` to get the extended Member profile (`MaxBooksAllowed`, `FullName`, `RoleName`).
7. Verify the user has the 'Member' role (BR-6).
8. Generate a JWT containing the user's `UserID`, `MemberID`, `FullName`, and `MaxBooksAllowed`. Return this token and user data to the client.

#### [NEW] [authRoutes.js](file:///c:/Users/hp/Desktop/Book/Library%20Management%20System/backend/src/routes/authRoutes.js)
Setup the Express routes to map `/api/auth/login` to the `AuthController`.

---

### Frontend Setup (React/Vite)
We will need to install `react-router-dom` for handling page routing if it's not already installed.

---

#### [NEW] [Login.jsx](file:///c:/Users/hp/Desktop/Book/Library%20Management%20System/frontend/src/pages/Login.jsx)
A clean, responsive React component for the login form using a modern UI design (CSS Modules or Tailwind, though standard CSS or inline styles will be used for simplicity unless specified). It will handle:
- Form state for `email` and `password`.
- API calls to the backend login endpoint.
- Displaying specific error messages ("Invalid credentials", "Account is not active").
- Storing the JWT and User Profile in `localStorage` or React Context upon success, and navigating to the Dashboard.

#### [NEW] [MemberDashboard.jsx](file:///c:/Users/hp/Desktop/Book/Library%20Management%20System/frontend/src/pages/MemberDashboard.jsx)
A placeholder landing page for successful logins.
- It will read the user's profile from state/`localStorage`.
- It will display a welcome message with the `FullName`.
- It will clearly display the `MaxBooksAllowed` limit.
- Provide a Logout button to clear state and redirect to the Login page.

#### [MODIFY] [App.jsx](file:///c:/Users/hp/Desktop/Book/Library%20Management%20System/frontend/src/App.jsx)
Set up the `react-router-dom` routing to point to the new `Login` and `MemberDashboard` pages. 

## Open Questions

> [!IMPORTANT]
> 1. **Role Verification:** Do you know the exact `RoleID` for 'Member' in your `Roles` table, or should the query fetch by `RoleName = 'Member'`? (The implementation will default to joining and checking `RoleName = 'Member'`).
> 2. **Database Config:** Is there an existing database connection pool file in `backend/src/config/db.js` that `MemberModel` should use? (I will assume there is or create a placeholder).
> 3. **Environment Variables:** Do you have `JWT_SECRET` set in your `.env` file? (I will assume it is needed).

## Verification Plan

### Automated/Manual Verification
- Install the required dependencies (`bcryptjs`, `jsonwebtoken`, `react-router-dom`).
- Mock a `Member` and `User` in the database manually or provide a mock script.
- Attempt to login with an invalid email -> verify generic error.
- Attempt to login with an invalid password -> verify generic error.
- Attempt to login with a 'Suspended' account -> verify 'Account is not active' error.
- Attempt to login with valid credentials -> verify successful redirect to the Dashboard, displaying `FullName` and `MaxBooksAllowed`.
