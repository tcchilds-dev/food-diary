# **Food Diary API Documentation**

## **Overview**

A simple API for tracking users and entries for food, symptoms, and exercise.

## **Base URL**

```
http://localhost:3000/api
```

## **Authentication**

This API uses **JSON Web Tokens (JWT)** for authentication.

### **Getting a Token**

Register or log in to receive a JWT token in the response.

### **Using the Token**

Include the token in the `Authorization` header of your requests:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### **Protected Endpoints**

All endpoints except `/auth/register` and `/auth/login` require authentication.

---

## **Endpoints**

### **Register New User**

`POST /auth/register`

Registers a new user.

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name?": "John Doe"
}
```

**Response (201)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error (400) - Missing Email or Password**

```json
{
  "error": "Email and password are required"
}
```

**Error (400) - User Already Exists**

```json
{
  "error": "User already exists"
}
```

**Error (500) - Failed Creating User**

```json
{
  "error": "Error creating user"
}
```

---

### **Log In**

`POST /auth/login`

Logs a user in.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (201)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error (400) - Missing Email or Password**

```json
{
  "error": "Email and password are required"
}
```

**Error (401) - Invalid Credentials**

```json
{
  "error": "Invalid credentials"
}
```

**Error (500) - Failed to Log In**

```json
{
  "error": "Error logging in"
}
```

---

### **Get Profile**

`GET /auth/profile`

Retrieves a user's data.

**Authentication Required:**
Yes — include JWT token in `Authorization` header.

**Request:**
No body or parameters needed. The user is identified from the JWT token.

**Response (200)**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

**Error (401)**

```json
{
  "error": "Unauthorized"
}
```

**Error (404)**

```json
{
  "error": "User not found"
}
```

**Error (500)**

```json
{
  "error": "Error fetching profile"
}
```

---

### **Create Entry**

`POST /entries`

Creates a new food diary entry.

**Authentication Required:**
Yes — include JWT token in `Authorization` header.

**Request Body**

```json
{
  "entryType": "food",

  "mealType?": "breakfast",
  "foodName?": "bagel",
  "calories?": 120,

  "symptomType?": "pain",
  "symptomSeverity?": 3,

  "exerciseType?": "walking",
  "exerciseIntensity?": 2,
  "exerciseDuration?": 120,

  "notes": "Salmon and cream cheese"
}
```

**Response (201)**

```json
{
  "userId": 1,

  "entryType": "food",

  "mealType?": "breakfast",
  "foodName?": "bagel",
  "calories?": 120,

  "symptomType?": "pain",
  "symptomSeverity?": 3,

  "exerciseType?": "walking",
  "exerciseIntensity?": 2,
  "exerciseDuration?": 120,

  "notes": "Salmon and cream cheese"
}
```

**Error (500)**

```json
{
  "error": "Error creating entry"
}
```

---

### **Get Entries**

`GET /entries`

Returns all entries for the authenticated user, with optional filtering.

**Authentication Required:**
Yes — include JWT token in `Authorization` header.

**Query Parameters:**

| Parameter   | Type                | Description                                                |
| ----------- | ------------------- | ---------------------------------------------------------- |
| `date`      | string (YYYY-MM-DD) | Filter entries for a specific date                         |
| `startDate` | string (YYYY-MM-DD) | Filter entries from this date (use with `endDate`)         |
| `endDate`   | string (YYYY-MM-DD) | Filter entries until this date (use with `startDate`)      |
| `entryType` | string              | Filter by entry type (e.g., "food", "symptom", "exercise") |

**Example Requests:**

Get all entries:

```
GET /entries
```

Get entries for a specific date:

```
GET /entries?date=2025-11-07
```

Get entries in a date range:

```
GET /entries?startDate=2025-11-01&endDate=2025-11-07
```

Get only food entries:

```
GET /entries?entryType=food
```

Combine filters:

```
GET /entries?entryType=symptom&startDate=2025-11-01&endDate=2025-11-07
```

**Response (201)**

```json
[
  {
    "userId": 1,
    "entryType": "food",
    "mealType?": "breakfast",
    "foodName?": "bagel",
    "calories?": 120,
    "notes": "Salmon and cream cheese"
  },
  {
    "userId": 2,
    "entryType": "food",
    "mealType?": "breakfast",
    "foodName?": "bagel",
    "calories?": 120,
    "notes": "Salmon and cream cheese"
  }
]
```

Returns an empty array `[]` if no entries match the filters.

**Error (500)**

```json
{
  "error": "Error fetching entries"
}
```

---

### **Delete Entry**

`DELETE /entries/:id`

Deletes the specified entry.

**Authentication Required:**
Yes — include JWT token in `Authorization` header.

**Request Parameters**

```json
{
  "id": 1
}
```

**Response (200)**

```json
{
  "message": "Entry deleted successfully"
}
```

**Error (400) - Missing :id or Authentication**

```json
{
  "error": "Invalid request"
}
```

**Error (404)**

```json
{
  "error": "Entry not found"
}
```

**Error (500)**

```json
{
  "error": "Error deleting entry"
}
```

---
