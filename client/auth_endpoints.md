# AbroadLift Authentication API Documentation

This document lists and explains all authentication, signup, login, and OTP endpoints in the AbroadLift system.

---

## 1. Register User / Send Login OTP
* **Endpoint:** `POST /api/auth/register`
* **Description:** Registers a new `STUDENT` user, initializes their student profile, and sends a verification OTP to their phone. If the user already exists, it will send an OTP for login instead.

### Request Body
```json
{
  "name": "Your Name",
  "email": "your.email@example.com",
  "countryDialCode": "+977",
  "phoneNumber": "9812345678",
  "prefersWhatsApp": true,
  "nationality": "Nepalese",
  "currentCountry": "Nepal",
  "gpa": "3.85"
}
```

### Response (New User Created - Status 201)
```json
{
  "user": {
    "id": "abc-123-xyz",
    "name": "Your Name",
    "username": "yourusername",
    "email": "your.email@example.com",
    "countryDialCode": "+977",
    "phoneNumber": "9812345678",
    "phoneE164": "+9779812345678",
    "phoneVerified": false,
    "role": "STUDENT"
  },
  "otp": {
    "sent": true,
    "channel": "WHATSAPP",
    "phoneE164": "+9779812345678"
  }
}
```

### Response (Existing User - Status 200)
```json
{
  "existingUser": true,
  "message": "Account already exists. OTP sent for login.",
  "user": {
    "id": "existing-user-id",
    "email": "jane@example.com",
    "countryDialCode": "+977",
    "phoneNumber": "9812345678",
    "phoneE164": "+9779812345678"
  },
  "otp": {
    "sent": true,
    "channel": "WHATSAPP",
    "phoneE164": "+9779812345678"
  }
}
```

---

## 2. Request OTP Code
* **Endpoint:** `POST /api/auth/request-otp`
* **Description:** Requests a fresh OTP for a pre-existing phone number.

### Request Body
```json
{
  "phoneE164": "+9779812345678"
}
```
*Note: Alternatively, `countryDialCode` and `phoneNumber` can be passed.*

### Response (Status 200)
```json
{
  "sent": true,
  "channel": "WHATSAPP"
}
```

---

## 3. Verify Signup OTP
* **Endpoint:** `POST /api/auth/verify-signup-otp`
* **Description:** Verifies that a code matches the active OTP sent to the user during registration. Sets `phoneVerified` to `true`.

### Request Body
```json
{
  "phoneE164": "+9779812345678",
  "otp": "123456"
}
```

### Response (Status 200)
```json
{
  "verified": true
}
```

---

## 4. Mobile Direct Login (OTP-based Session)
* **Endpoint:** `POST /api/auth/mobile/login`
* **Description:** Directly logs in mobile applications. Validates the OTP and returns a signed JWT secure token along with user details.

### Request Body
```json
{
  "phoneE164": "+9779812345678",
  "otp": "123456"
}
```

### Response (Status 200)
```json
{
  "user": {
    "id": "user-uuid",
    "name": "Your Name",
    "email": "your.email@example.com",
    "username": "yourusername",
    "role": "STUDENT",
    "profile": {
      "nationality": "Nepalese",
      "currentCountry": "Nepal",
      "gpa": 3.85
    }
  },
  "token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..."
}
```

---

## 5. Web Auth Sessions (NextAuth)
* **Endpoint:** `POST /api/auth/callback/credentials`
* **Description:** NextAuth endpoint for authenticating students via OTP or admins via password.

### Student Authentication Parameters:
* **Provider:** `credentials`
```json
{
  "phone": "+9779812345678",
  "otp": "123456"
}
```

### Admin Authentication Parameters:
* **Provider:** `admin-credentials`
```json
{
  "identifier": "admin@abroadlift.com",
  "password": "securepassword123"
}
```
