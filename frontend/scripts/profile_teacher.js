const fetchProfile = async () => {
    const res = await fetch("/api/teacher/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}` }
    });

    const data = await res.json();
    document.querySelector("#nickname").innerText = data.profile.nickname;
    document.querySelector("#email").innerText = data.profile.email;
    document.querySelector("#school").innerText = data.profile.school;
    document.querySelector("#richting").innerText = data.profile.richting;
    document.querySelector("#avatar").src = data.profile.avatar_url || "../public/default-avatar.png";

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

    const res = await fetch("/api/teacher/profile/upload-avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}` },
        body: formData
    });

    if (res.ok) location.reload();
};

document.querySelector("#uploadBtn").addEventListener("click", uploadAvatar);

fetchProfile();
