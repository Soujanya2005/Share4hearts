// dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// Simulate logged-in user
const userId = "user001";

async function loadDashboard() {
  const ref = doc(db, "users", userId);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const user = snapshot.data();

    document.getElementById("username").textContent = user.name || "User";
    document.getElementById("points").textContent = user.points || 0;
    document.getElementById("streak").textContent = (user.streak || 0) + "🔥";
    document.getElementById("donations").textContent = user.donations || 0;

    // Badges
    const badgeContainer = document.getElementById("badges");
    badgeContainer.innerHTML = "";
    if (user.badges?.length) {
      user.badges.forEach(b => {
        const div = document.createElement("div");
        div.classList.add("badge");
        div.textContent = b;
        badgeContainer.appendChild(div);
      });
    } else {
      badgeContainer.innerHTML = "<p>No badges yet 💫</p>";
    }
  }

  // Leaderboard
  const col = collection(db, "users");
  const allUsers = await getDocs(col);
  const users = [];
  allUsers.forEach(doc => users.push(doc.data()));
  users.sort((a, b) => b.points - a.points);

  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  users.slice(0, 5).forEach((u, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} ${u.name || "User"} — ${u.points || 0} pts`;
    list.appendChild(li);
  });

  // Community progress
  let totalDonations = users.reduce((sum, u) => sum + (u.donations || 0), 0);
  const goal = 100;
  const percentage = Math.min((totalDonations / goal) * 100, 100);
  document.getElementById("progress").style.width = percentage + "%";
  document.getElementById("progressText").textContent =
    `Total Donations: ${totalDonations} / ${goal}`;
}

loadDashboard();
