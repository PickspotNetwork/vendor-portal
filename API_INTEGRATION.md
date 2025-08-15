# API Integration Documentation

## Environment Setup

Add the following to your `.env` file:

```
NEXT_PUBLIC_BASE_URL="https://3d128z4j-3001.inc1.devtunnels.ms/api/v1"
```

## API Endpoints

### Authentication

#### Signup

- **Endpoint**: `POST /auth/vendors/signup`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "0708575242",
    "password": "mySecureP@ss"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "message": "account created successfully",
    "data": {
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "0708575243",
      "password": "$2b$10$fFcNskiiEZ7fHLbGWvuo8.ZwJqwaBaDbYiMIpB13NAnp0DPiBCv4q",
      "role": "vendor",
      "_id": "6895ba1408b4d3836e8e28b4",
      "createdAt": "2025-08-08T08:49:24.954Z",
      "updatedAt": "2025-08-08T08:49:24.954Z",
      "__v": 0
    }
  }
  ```
- **Error Response** (400):
  ```json
  {
    "message": "User already exist"
  }
  ```

#### Login

- **Endpoint**: `POST /auth/vendors/login`
- **Body**:
  ```json
  {
    "phoneNumber": "0708575242",
    "password": "mySecureP@ss"
  }
  ```
- **Success Response** (200):

  ```json
  {
    "message": "You have logged in successfully"
  }
  ```

  - **Headers**: Authentication cookies are set automatically
    - `access_token=eyJhbGciOi...; HttpOnly; Secure; SameSite=None; Path=/`
    - `refresh_token=eyJhbGciOi...; HttpOnly; Secure; SameSite=None; Path=/`

- **Error Response** (401):
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

#### Logout

- **Endpoint**: `POST /auth/vendors/logout`
- **Body**: None required
- **Success Response** (200):
  ```json
  {
    "status": "success",
    "message": "you have logged out successfully."
  }
  ```
- **Note**: Clears authentication cookies automatically

## Implementation Features

### ✅ Completed Features

1. **API Service Layer** (`lib/api.ts`)
   - Centralized API calls with proper error handling
   - Automatic cookie handling for authentication
   - TypeScript interfaces for type safety

2. **Authentication Hook** (`hooks/useAuth.ts`)
   - State management for loading, error, and success states
   - Automatic redirect to dashboard after login
   - Form validation and error handling

3. **UI Components**
   - Loading states with spinner animations
   - Success/error notifications
   - Form validation and disabled states during API calls
   - Responsive design

4. **User Experience**
   - Auto-switch to login tab after successful signup
   - Pre-fill phone number in login form after signup
   - Clear error/success messages
   - Proper form validation

5. **Security**
   - HttpOnly cookies for token storage
   - Credentials included in API calls
   - Proper error handling without exposing sensitive data

### 🔄 User Flow

1. **Signup Flow**:
   - User fills signup form → API call → Success message → Auto-switch to login tab → Phone number pre-filled

2. **Login Flow**:
   - User fills login form → API call → Success message → Redirect to dashboard

3. **Error Handling**:
   - API errors displayed as notifications
   - Form validation prevents empty submissions
   - Loading states prevent multiple submissions

## File Structure

```
├── lib/
│   └── api.ts                 # API service layer
├── hooks/
│   └── useAuth.ts            # Authentication hook
├── components/
│   ├── ui/
│   │   └── notification.tsx  # Notification component
│   └── login-form.tsx        # Main login/signup form
├── app/
│   ├── page.tsx              # Login page
│   └── dashboard/
│       └── page.tsx          # Dashboard after login
└── .env                      # Environment variables
```

## Usage

The authentication system is fully integrated and ready to use. Users can:

1. Create new accounts via the signup form
2. Login with their credentials
3. Receive proper feedback for all actions
4. Be automatically redirected to the dashboard after successful login

All API calls include proper error handling and user feedback through the notification system.
