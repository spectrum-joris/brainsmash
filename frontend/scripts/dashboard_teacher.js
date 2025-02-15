document.addEventListener("DOMContentLoaded", async () => {
    const quizList = document.querySelector("#quiz-list");
    const highestScoreElem = document.querySelector("#highest-score");
    const totalAttemptsElem = document.querySelector("#total-attempts");
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-button");

    // ✅ Haal token op uit localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Geen token gevonden. Redirect naar login.");
        window.location.href = "/pages/login.html";
        return;
    }

    try {
        const res = await fetch("/api/quizzes/teacher", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Token correct meesturen
            }
        });

        const quizzes = await res.json();

        console.log("✅ Debug: Quiz API response:", quizzes);

        if (!res.ok) throw new Error(quizzes.error || "Kon quizzen niet ophalen");

        if (quizzes.length === 0) {
            quizList.innerHTML = "<p>Je hebt nog geen quizzen aangemaakt.</p>";
            return;
        }

        renderQuizList(quizzes);

        // ✅ Bereken statistieken
        const allScores = quizzes.flatMap(quiz => quiz.scores || []);
        const highestScore = allScores.length ? Math.max(...allScores) : 0;
        const totalAttempts = allScores.length;

        highestScoreElem.textContent = highestScore;
        totalAttemptsElem.textContent = totalAttempts;

        // ✅ Zoekfunctie
        searchButton.addEventListener("click", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredQuizzes = quizzes.filter(quiz =>
                quiz.title.toLowerCase().includes(searchTerm) ||
                quiz.course.toLowerCase().includes(searchTerm)
            );
            renderQuizList(filteredQuizzes);
        });

    } catch (error) {
        console.error("❌ Fout bij ophalen quizzen:", error.message);
        quizList.innerHTML = `<p class="error">Fout bij ophalen quizzen. Probeer later opnieuw.</p>`;
    }
});

function renderQuizList(quizzes) {
    const quizList = document.querySelector("#quiz-list");
    quizList.innerHTML = quizzes.map(quiz => `
        <div class="quiz-card">
            <h3>${quiz.title}</h3>
            <p><strong>Vak:</strong> ${quiz.course}</p>
            <p><strong>Moeilijkheid:</strong> ${quiz.difficulty}</p>
            <button onclick="editQuiz('${quiz.id}')">Bewerken</button>
            <button onclick="deleteQuiz('${quiz.id}')">Verwijderen</button>
        </div>
    `).join("");
}

// ✅ Quiz verwijderen met token in de header
async function deleteQuiz(quizId) {
    if (!confirm("Weet je zeker dat je deze quiz wilt verwijderen?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Geen token gevonden. Redirect naar login.");
        window.location.href = "/pages/login.html";
        return;
    }

    try {
        const res = await fetch(`/api/quizzes/${quizId}`, { 
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Token meesturen bij verwijderen
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Kon quiz niet verwijderen");

        alert("Quiz succesvol verwijderd!");
        location.reload();

    } catch (error) {
        console.error("❌ Fout bij verwijderen quiz:", error.message);
        alert("Fout bij verwijderen quiz. Probeer later opnieuw.");
    }
}

function editQuiz(quizId) {
    window.location.href = `/pages/teacher_create_quiz.html?id=${quizId}`;
}
