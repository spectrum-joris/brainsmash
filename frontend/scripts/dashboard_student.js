document.addEventListener("DOMContentLoaded", async () => {
    const quizList = document.querySelector("#quiz-list");

    // ✅ Haal token op uit localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Geen token gevonden. Redirect naar login.");
        window.location.href = "/pages/login.html";
        return;
    }

    try {
        const res = await fetch("/api/quizzes/student", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Stuur het token mee
            }
        });
        
        console.log("Token:", token);

        const quizzes = await res.json();

        console.log("✅ Debug: Quiz API response:", quizzes);

        if (!res.ok) throw new Error(quizzes.error || "Kon quizzen niet ophalen");

        if (quizzes.length === 0) {
            quizList.innerHTML = "<p>Er zijn nog geen quizzen beschikbaar voor jouw richting.</p>";
            return;
        }

        quizList.innerHTML = quizzes.map(quiz => `
            <div class="quiz-card">
                <h3>${quiz.title}</h3>
                <p><strong>Vak:</strong> ${quiz.course}</p>
                <p><strong>Moeilijkheid:</strong> ${quiz.difficulty}</p>
                <button onclick="startQuiz('${quiz.id}')">Start Quiz</button>
            </div>
        `).join("");

    } catch (error) {
        console.error("❌ Fout bij ophalen quizzen:", error);
        quizList.innerHTML = `<p class="error">Fout bij ophalen quizzen. Probeer later opnieuw.</p>`;
    }
});

function startQuiz(quizId) {
    window.location.href = `/pages/quiz.html?id=${quizId}`;
}
