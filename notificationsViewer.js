import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// Simulate current user
const currentUserId = "auth.currentUser.uid"; // Replace with actual auth.currentUser.uid

const notificationsDiv = document.getElementById("notifications");

// Listen in real-time for notifications for this user
const q = query(
  collection(db, "notifications"),
  where("to", "array-contains", currentUserId),
  orderBy("timestamp", "desc")
);

onSnapshot(q, (snapshot) => {
  notificationsDiv.innerHTML = ""; // clear old
  snapshot.forEach((docSnap) => {
    const notif = docSnap.data();
    const div = document.createElement("div");
    div.className = "notification" + (notif.read ? "" : " unread");

    const p = document.createElement("p");
    const time = notif.timestamp?.toDate?.().toLocaleString() || "";
    p.textContent = `${notif.message} (${time})`;

    const btn = document.createElement("button");
    btn.className = "mark-read";
    btn.textContent = notif.read ? "Read" : "Mark as Read";
    btn.disabled = notif.read;
    btn.onclick = async () => {
      await updateDoc(doc(db, "notifications", docSnap.id), { read: true });
    };

    div.appendChild(p);
    div.appendChild(btn);
    notificationsDiv.appendChild(div);
  });
});
