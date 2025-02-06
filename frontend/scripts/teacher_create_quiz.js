const vragen = [];

const addQuestion = () => {
    const vragenContainer = document.querySelector("#vragenContainer");
    const vraagIndex = vragen.length;
    
    const vraagDiv = document.createElement("div");
    vraagDiv.innerHTML = `
        <input type="text" placeholder="Vraagtekst" id="vraagText${vraagIndex}" required>
        <select id="vraagType${vraagIndex}" onchange="toggleOptions(${vraagIndex})">
            <option value="multiple_choice">Meerkeuze</option>
            <option value="open">Open</option>
        </select>
        <div id="optionsContainer${vraagIndex}">
            <input type="text" placeholder="Optie 1" id="optie1_${vraagIndex}">
            <input type="text" placeholder="Optie 2" id="optie2_${vraagIndex}">
            <input type="text" placeholder="Optie 3" id="optie3_${vraagIndex}">
            <input type="text" placeholder="Optie 4" id="optie4_${vraagIndex}">
            <input type="text" placeholder="Correct Antwoord" id="correctAnswer${vraagIndex}" required>
        </div>
        <label>Tijdslimiet (s):</label>
        <select id="timeLimit${vraagIndex}">
            <option value="10">10s</option>
            <option value="20">20s</option>
            <option value="30">30s</option>
            <option value="60">60s</option>
        </select>
    `;
    
    vragenContainer.appendChild(vraagDiv);
    vragen.push({});
};

const submitQuiz = async (event) => {
    event.preventDefault();

    const vragenData = vragen.map((_, index) => ({
        question_text: document.querySelector(`#vraagText${index}`).value,
        type: document.querySelector(`#vraagType${index}`).value,
        options: [
            document.querySelector(`#optie1_${index}`).value,
            document.querySelector(`#optie2_${index}`).value,
            document.querySelector(`#optie3_${index}`).value,
            document.querySelector(`#optie4_${index}`).value
        ].filter(opt => opt),
        correct_answers: [document.querySelector(`#correctAnswer${index}`).value],
        time_limit: document.querySelector(`#timeLimit${index}`).value
    }));

    const res = await fetch("/api/teacher/quizzes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}`
        },
        body: JSON.stringify({
            titel: document.querySelector("#titel").value,
            moeilijkheidsgraad: document.querySelector("#moeilijkheidsgraad").value,
            richting: document.querySelector("#richting").value,
            graad: document.querySelector("#graad").value,
            vragen: vragenData
        })
    });

    if (res.ok) {
        alert("Quiz succesvol aangemaakt!");
        window.location.href = "teacher_dashboard.html";
    }
};

document.querySelector("#quizForm").addEventListener("submit", submitQuiz);
