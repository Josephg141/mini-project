# Security Guidelines

This project uses **Firebase Authentication** with email and password, and **Firestore** as the database. Security is handled at both the API and database level.

---

## 1. API Authentication

- Backend routes (`/me`, `/click`) verify the Firebase ID token to ensure only authenticated users can access or modify their data:

```javascript
const decoded = await admin.auth().verifyIdToken(idToken);

// See frontend/firestore.rules for full rules
