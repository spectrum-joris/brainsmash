const fetchQuizzes = async () => {
    const res = await fetch("/api/teacher/quizzes", {
        method: "GET",
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}` }
    });

    const quizzes = await res.json();
    const quizTable = document.querySelector("#quizTable");

    quizTable.innerHTML = ""; // Leeg de tabel voordat je nieuwe data invoegt

    quizzes.forEach(quiz => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${quiz.titel}</td>
            <td>${quiz.moeilijkheidsgraad}</td>
            <td>${quiz.richting} - ${quiz.graad}</td>
            <td>
                <button onclick="editQuiz('${quiz.id}')">Bewerken</button>
                <button onclick="deleteQuiz('${quiz.id}')">Verwijderen</button>
            </td>
        `;
        quizTable.appendChild(row);
    });
};

const deleteQuiz = async (quizId) => {
    if (!confirm("Weet je zeker dat je deze quiz wilt verwijderen?")) return;

    const res = await fetch(`/api/teacher/quizzes/${quizId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}` }
    });

    const data = await res.json();
    if (data.error) {
        alert(data.error);
    } else {
        alert("Quiz verwijderd!");
        fetchQuizzes();
    }
};

const editQuiz = (quizId) => {
    window.location.href = `teacher_edit_quiz.html?id=${quizId}`;
};

// Zoekfunctie
document.querySelector("#searchInput").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    document.querySelectorAll("#quizTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(searchTerm) ? "" : "none";
    });
});

fetchQuizzes();
