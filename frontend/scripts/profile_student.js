// Haal profiel- en statistiekgegevens op voor een leerling via de backend
const fetchProfile = async () => {
    // Haal de JWT direct op uit localStorage
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
      console.error("Fout bij ophalen van profielgegevens.");
      return;
    }
  
    const data = await res.json();
  
    // Vul de profielgegevens in
    document.querySelector("#nickname").innerText = data.profile.nickname || "Nog geen nickname";
    document.querySelector("#email").innerText = data.profile.email || "";
    document.querySelector("#school").innerText = data.profile.school?.school_name || ""; // dit halen we uit relationele tabel schools
    document.querySelector("#richting").innerText = data.profile.program?.program_name || ""; // dit halen we uit relationele tabel programs
    document.querySelector("#grade").innerText = data.profile.grade?.grade_name || ""; // dit halen we uit relationele tabel grades
    document.querySelector("#avatar").src = data.profile.avatar_url || "../public/icons/person.svg";
  
    // Vul de student-specifieke quizstatistieken in
    document.querySelector("#completedQuizzes").innerText = data.quizStats.completed_quizzes || 0;
    document.querySelector("#totalAttempts").innerText = data.quizStats.total_attempts || 0;
    document.querySelector("#avgScore").innerText = data.quizStats.avg_score ? data.quizStats.avg_score.toFixed(2) : "0";
    document.querySelector("#bestScore").innerText = data.quizStats.best_score || 0;
    document.querySelector("#currentRanking").innerText = data.quizStats.current_ranking || "N/A";
    document.querySelector("#xpPoints").innerText = data.quizStats.xp_points || 0;
    document.querySelector("#qbits").innerText = data.quizStats.qbits || 0;
};
  
const uploadAvatar = async () => {
    const file = document.querySelector("#avatarUpload").files[0];
    if (!file) return alert("Selecteer een afbeelding");
  
    const accessToken = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);
  
    const res = await fetch("/api/student/profile/upload-avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
    });
  
    if (res.ok) {
      location.reload();
    } else {
      console.error("Fout bij uploaden avatar");
    }
};
  
document.querySelector("#uploadBtn").addEventListener("click", uploadAvatar);
  
// Start de fetch-functie zodra de DOM geladen is
fetchProfile();
