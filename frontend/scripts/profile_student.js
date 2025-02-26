const fetchProfile = async () => {
  const accessToken = localStorage.getItem("token");
  if (!accessToken) {
      console.error("❌ Geen access token gevonden.");
      return;
  }

  const res = await fetch("/api/student/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
      console.error("❌ Fout bij ophalen van profielgegevens.");
      return;
  }

  const data = await res.json();

  // 🔹 Profielgegevens invullen
  document.querySelector("#nickname").innerText = data.profile.nickname || "Nog geen nickname";
  document.querySelector("#email").innerText = data.profile.email || "";
  document.querySelector("#school").innerText = data.profile.school?.school_name || "";
  document.querySelector("#richting").innerText = data.profile.program?.program_name || "";
  document.querySelector("#grade").innerText = data.profile.grade?.grade_name || "";

  // 🔹 Quiz-statistieken invullen
  document.querySelector("#completedQuizzes").innerText = data.quizStats.completed_quizzes || 0;
  document.querySelector("#totalAttempts").innerText = data.quizStats.total_attempts || 0;
  document.querySelector("#avgScore").innerText = data.quizStats.avg_score ? data.quizStats.avg_score.toFixed(2) : "0";
  document.querySelector("#bestScore").innerText = data.quizStats.best_score || 0;
  document.querySelector("#currentRanking").innerText = data.quizStats.current_ranking || "N/A";
  document.querySelector("#xpPoints").innerText = data.quizStats.xp_points || 0;
  document.querySelector("#qbits").innerText = data.quizStats.qbits || 0;

  // 🔹 Avatar tonen of het Material Icon tonen
  const avatarElement = document.querySelector("#avatar");
  const iconElement = document.querySelector("#avatarIcon");

  // 🔥 Fix: Voeg timestamp toe om caching te vermijden
  if (typeof data.profile.avatar_url === "string" && data.profile.avatar_url.startsWith("http")) {
    const uniqueUrl = `${data.profile.avatar_url}?t=${new Date().getTime()}`; // ✅ Voegt unieke timestamp toe
    console.log("✅ Profiel heeft avatar:", uniqueUrl);
    avatarElement.src = uniqueUrl;
    avatarElement.style.display = "block";
    iconElement.style.display = "none"; // 🔥 Verberg het icon als een avatar is ingesteld
} else {
    avatarElement.style.display = "none";
    iconElement.style.display = "block"; // 🔥 Toon het icon als er geen avatar is
}
};

// **Automatisch uploaden zodra een bestand wordt gekozen**
const uploadAvatar = async () => {
  const fileInput = document.querySelector("#avatarUpload");
  const file = fileInput.files[0];

  if (!file) return;

  const accessToken = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/student/profile/upload-avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
  });

  const data = await res.json();

  if (res.ok && data.avatar_url) {
      // 🚀 **Update de avatar direct zonder pagina te herladen**
      document.querySelector("#avatar").src = data.avatar_url;
      document.querySelector("#avatar").style.display = "block";
      document.querySelector("#avatarIcon").style.display = "none"; // 🔥 Verberg het icon
  } else {
      console.error("❌ Fout bij uploaden avatar", data);
  }
};

// **Bind de upload functie aan de avatar**
document.querySelector("#avatarUpload").addEventListener("change", uploadAvatar);

// **Start de fetch-functie zodra de DOM geladen is**
fetchProfile();
