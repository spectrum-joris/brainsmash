const fetchProfile = async () => {
    const accessToken = JSON.parse(localStorage.getItem("user")).access_token;
    const res = await fetch("/api/teacher/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!res.ok) {
      console.error("Fout bij ophalen van profielgegevens.");
      return;
    }
    
    const data = await res.json();
    
    document.querySelector("#nickname").innerText = data.profile.nickname;
    document.querySelector("#email").innerText = data.profile.email;
    document.querySelector("#school").innerText = data.profile.school?.school_name || "";
    document.querySelector("#program").innerText = data.profile.program?.program_name || "";
    document.querySelector("#avatar").src = data.profile.avatar_url || "../public/icons/person.svg";
    
    document.querySelector("#totalQuizzes").innerText = data.quizStats.total_quizzes;
    document.querySelector("#totalAttempts").innerText = data.quizStats.total_attempts;
    document.querySelector("#avgScore").innerText = data.quizStats.avg_score.toFixed(2);
    document.querySelector("#bestQuiz").innerText = data.quizStats.best_quiz;
  };
  
  const uploadAvatar = async () => {
    const file = document.querySelector("#avatarUpload").files[0];
    if (!file) return alert("Selecteer een afbeelding");
    
    const formData = new FormData();
    formData.append("avatar", file);
    
    const accessToken = JSON.parse(localStorage.getItem("user")).access_token;
    const res = await fetch("/api/teacher/profile/upload-avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
    });
    
    if (res.ok) location.reload();
    else console.error("Fout bij uploaden avatar");
  };
  
  document.querySelector("#uploadBtn").addEventListener("click", uploadAvatar);
  
  fetchProfile();
  