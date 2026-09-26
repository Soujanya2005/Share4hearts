// gamification.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8p97ph9lfvVkoAd4SucxL1aQ0NGHLmjY",
  authDomain: "sharecare-616af.firebaseapp.com",
  projectId: "sharecare-616af",
  storageBucket: "sharecare-616af.firebasestorage.app",
  messagingSenderId: "45027282617",
  appId: "1:45027282617:web:55627278ee0421fc06d568",
  measurementId: "G-ZY25LNSPMD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🎯 Simulated user (later you can replace this with Firebase Auth user)
const userId = "user001";

async function initUser() {
  const ref = doc(db, "users", userId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      name: "Soujanya",
      points: 0,
      streak: 0,
      badges: [],
      donations: 0,
      thankYouNotes: [],
      lastLogin: new Date().toISOString()
    });
    console.log("✨ New user created!");
  } else {
    console.log("✅ Welcome back, Soujanya!");
    updateStreak();
  }
}

// 🔥 Update streak if logged in daily
async function updateStreak() {
  const ref = doc(db, "users", userId);
  const user = await getDoc(ref);
  const data = user.data();
  const last = new Date(data.lastLogin);
  const today = new Date();

  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) {
    await updateDoc(ref, {
      streak: data.streak + 1,
      lastLogin: today.toISOString()
    });
    console.log("🔥 Streak continued!");
  } else if (diffDays > 1) {
    await updateDoc(ref, { streak: 1, lastLogin: today.toISOString() });
    console.log("⚡ Streak reset.");
  }
}

// 💖 Add kindness points (for any action)
async function addPoints(amount) {
  const ref = doc(db, "users", userId);
  const user = await getDoc(ref);
  const newPoints = user.data().points + amount;

  await updateDoc(ref, { points: newPoints });
  console.log(`🪙 You earned ${amount} points! Total: ${newPoints}`);

  checkBadges(newPoints);
}

// 🏅 Badge assignment
async function checkBadges(points) {
  const ref = doc(db, "users", userId);
  const user = await getDoc(ref);
  const badges = user.data().badges;

  if (points >= 100 && !badges.includes("Helper")) {
    badges.push("Helper");
  }
  if (points >= 500 && !badges.includes("Hero")) {
    badges.push("Hero");
  }
  if (points >= 1000 && !badges.includes("Legend")) {
    badges.push("Legend");
  }

  await updateDoc(ref, { badges });
}

// 💌 Add a thank-you note (receiver to donor)
async function sendThankYou(message) {
  const ref = doc(db, "users", userId);
  const user = await getDoc(ref);
  const notes = user.data().thankYouNotes;
  notes.push(message);
  await updateDoc(ref, { thankYouNotes: notes });
}

// 🏆 Show leaderboard (top 5 users)
async function showLeaderboard() {
  const col = collection(db, "users");
  const snapshot = await getDocs(col);
  const users = [];
  snapshot.forEach((doc) => users.push(doc.data()));
  users.sort((a, b) => b.points - a.points);
  console.table(users.slice(0, 5));
}

// 🎯 Community challenge (total donations)
async function showCommunityProgress() {
  const col = collection(db, "users");
  const snapshot = await getDocs(col);
  let total = 0;
  snapshot.forEach((doc) => (total += doc.data().donations || 0));
  const goal = 100;
  console.log(`🎯 Community Goal: ${total}/${goal} donations`);
}

// Example usage:
initUser();
// addPoints(50);
// sendThankYou("Thank you for helping me 💖");
// showLeaderboard();
// showCommunityProgress();
