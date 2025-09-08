const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Use service account stored locally or via environment variable
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON || require("./serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/ping", (req, res) => {
  res.send("pong 🏓 backend alive");
});

// Protected endpoint: get user info and click count
app.get("/me", async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).json({ error: "Unauthorized" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const userDocRef = admin.firestore().doc(`users/${decoded.uid}/usage/buttonClicks`);
    const userDoc = await userDocRef.get();

    res.json({
      uid: decoded.uid,
      email: decoded.email,
      clicks: userDoc.exists ? userDoc.data().count : 0
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Increment click count
app.post("/click", async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).json({ error: "Unauthorized" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const userDocRef = admin.firestore().doc(`users/${decoded.uid}/usage/buttonClicks`);

    await admin.firestore().runTransaction(async (t) => {
      const docSnap = await t.get(userDocRef);
      const newCount = docSnap.exists ? docSnap.data().count + 1 : 1;
      t.set(userDocRef, { count: newCount });
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
