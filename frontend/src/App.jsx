import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import "./App.css";

// backend URL CLOUD 
const BACKEND_URL = "https://mini-project-473337397291.us-central1.run.app"; // your Cloud Run URL

// Example for ping
fetch(`${BACKEND_URL}/ping`).then(res => res.text()).then(console.log);


function App() {
  const [user, setUser] = useState(null); // store current user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [count, setCount] = useState(0);
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup

  // Track auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Load count on user login
  useEffect(() => {
    if (!user) return;

    const fetchCount = async () => {
      const docRef = doc(db, "users", user.uid, "usage", "buttonClicks");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCount(docSnap.data().count);
      } else {
        await setDoc(docRef, { count: 0 });
        setCount(0);
      }
    };
    fetchCount();
  }, [user]);

  const handleClick = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "usage", "buttonClicks");
    await updateDoc(docRef, { count: increment(1) });
    setCount((prev) => prev + 1);
  };

  const handleSignup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Create initial button click count safely
    const userDocRef = doc(db, "users", uid, "usage", "buttonClicks");
    await setDoc(userDocRef, { count: 0 });

    console.log("User signed up successfully:", uid);
    setEmail("");
    setPassword("");
  } catch (error) {
    console.error("Signup error:", error.message);
  }
};

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <div className="container">
        <h1>{isLogin ? "Login" : "Signup"}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={isLogin ? handleLogin : handleSignup}>
          {isLogin ? "Login" : "Signup"}
        </button>
        <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Button Click Tracker</h1>
      <p>Welcome, {user.email}</p>
      <p>Click count: {count}</p>
      <button onClick={handleClick}>Click me!</button>
      <button onClick={handleLogout} style={{ marginTop: 10 }}>
        Logout
      </button>
    </div>
  );
}

export default App;