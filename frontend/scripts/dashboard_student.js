document.addEventListener("DOMContentLoaded", async () => {
    const quizList = document.querySelector("#quiz-list");

    try {
        const res = await fetch("/api/quizzes/student", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const quizzes = await res.json();

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
        console.error("❌ Fout bij ophalen quizzen:", error.message);
        quizList.innerHTML = `<p class="error">Fout bij ophalen quizzen. Probeer later opnieuw.</p>`;
    }
});

function startQuiz(quizId) {
    window.location.href = `/pages/quiz.html?id=${quizId}`;
}
