const vragen = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadDropdownData("programs", "program", "program_name", "Kies een richting");
    await loadDropdownData("grades", "grade", "grade_name", "Kies een graad");
    await loadDropdownData("subjects", "course", "subject_name", "Kies een vak");
});

// Algemene functie om een dropdown te vullen
const loadDropdownData = async (table, dropdownId, columnName, placeholderText) => {
    try {
        const res = await fetch(`/api/${table}`);
        if (!res.ok) throw new Error(`Fout bij ophalen van ${table}`);

        const data = await res.json();
        const dropdown = document.querySelector(`#${dropdownId}`);
        dropdown.innerHTML = `<option value="">${placeholderText}</option>`; // Eerste lege optie = dynamische placeholder tekst

        data.sort((a, b) => a[columnName].localeCompare(b[columnName])); // Sorteer alfabetisch

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item[columnName];
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error(`❌ Fout bij laden van ${table}:`, error);
    }
};

const toggleOptions = (index) => {
    const typeSelect = document.querySelector(`#vraagType${index}`);
    const optionsContainer = document.querySelector(`#optionsContainer${index}`);
    const correctAnswerInput = document.querySelector(`#correctAnswer${index}`);

    if (typeSelect.value === "open") {
        optionsContainer.style.display = "none";
        correctAnswerInput.placeholder = "Vul hier het correcte antwoord in";
    } else {
        optionsContainer.style.display = "block";
        correctAnswerInput.placeholder = "Geef de correcte optie in";
    }
};

const addQuestion = () => {
    const vragenContainer = document.querySelector("#vragenContainer");
    const vraagIndex = vragen.length;
    
    const vraagDiv = document.createElement("div");
    vraagDiv.classList.add("vraag-blok");
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
        </div>

        <label for="multipleCorrect${vraagIndex}">Meerdere correcte antwoorden?</label>
        <input type="checkbox" id="multipleCorrect${vraagIndex}" onchange="toggleCorrectAnswers(${vraagIndex})">
        
        <div id="correctAnswersContainer${vraagIndex}">
            <input type="text" placeholder="Correct Antwoord" id="correctAnswer${vraagIndex}" required>
        </div>
        <button type="button" onclick="addCorrectAnswer(${vraagIndex})">+ Voeg Correct Antwoord Toe</button>

        <label>Tijdslimiet (s):</label>
        <select id="timeLimit${vraagIndex}">
            <option value="10">10s</option>
            <option value="20">20s</option>
            <option value="30">30s</option>
            <option value="60">60s</option>
        </select>
        <button type="button" onclick="removeQuestion(${vraagIndex})">Verwijder Vraag</button>
    `;
    
    vragenContainer.appendChild(vraagDiv);
    vragen.push({});
};

// meerdere antwoorden mogelijk?
const toggleCorrectAnswers = (index) => {
    const multipleCorrect = document.querySelector(`#multipleCorrect${index}`).checked;
    const correctAnswerContainer = document.querySelector(`#correctAnswersContainer${index}`);

    if (multipleCorrect) {
        correctAnswerContainer.innerHTML = `<input type="text" placeholder="Correct Antwoord" id="correctAnswer${index}_0" required>`;
    } else {
        correctAnswerContainer.innerHTML = `<input type="text" placeholder="Correct Antwoord" id="correctAnswer${index}" required>`;
    }
};

// correct antwoord toevoegen bij meerdere mogelijke antwoorden
const addCorrectAnswer = (index) => {
    const multipleCorrect = document.querySelector(`#multipleCorrect${index}`).checked;
    if (!multipleCorrect) return;

    const correctAnswerContainer = document.querySelector(`#correctAnswersContainer${index}`);
    const answerCount = correctAnswerContainer.children.length;

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.placeholder = `Correct Antwoord ${answerCount + 1}`;
    newInput.id = `correctAnswer${index}_${answerCount}`;
    correctAnswerContainer.appendChild(newInput);
};


const removeQuestion = (index) => {
    document.querySelector(`#vragenContainer`).children[index].remove();
    vragen.splice(index, 1);
};

const submitQuiz = async (event) => {
    event.preventDefault();

    // 🛠️ User en token apart ophalen uit localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    console.log("🔍 User uit localStorage:", user);
    console.log("🔍 Token uit localStorage:", token);

    if (!user || !token) {
        alert("Je bent niet ingelogd. Log opnieuw in.");
        return;
    }

    console.log("🔍 Verzenden van quiz met token:", token);

    const quizData = {
        title: document.querySelector("#title").value,
        subject_id: document.querySelector("#course").value,
        difficulty: document.querySelector("#difficulty").value,
        program_id: document.querySelector("#program").value,
        grade_id: document.querySelector("#grade").value,
        teacher_id: user.id, // Teacher ID uit de opgeslagen user data
    };

    const vragenData = vragen.map((_, index) => {
        const type = document.querySelector(`#vraagType${index}`).value;
        const multipleCorrect = document.querySelector(`#multipleCorrect${index}`).checked;
    
        let correctAnswers = [];
        if (multipleCorrect) {
            document.querySelectorAll(`#correctAnswersContainer${index} input`).forEach(input => {
                if (input.value.trim()) correctAnswers.push(input.value.trim());
            });
        } else {
            correctAnswers = [document.querySelector(`#correctAnswer${index}`).value.trim()];
        }
    
        return {
            question_text: document.querySelector(`#vraagText${index}`).value,
            type,
            options: type === "multiple_choice"
                ? [
                    document.querySelector(`#optie1_${index}`).value.trim(),
                    document.querySelector(`#optie2_${index}`).value.trim(),
                    document.querySelector(`#optie3_${index}`).value.trim(),
                    document.querySelector(`#optie4_${index}`).value.trim()
                ].filter(opt => opt) // ✅ Lege opties verwijderen
                : null,
            correct_answers: correctAnswers, // ✅ Nu een array, geen JSON.stringify()
            time_limit: document.querySelector(`#timeLimit${index}`).value
        };
    });
    
    try {
        console.log("🔍 Verzenden van quiz met token:", token); // Debugging

        const quizRes = await fetch("http://localhost:3000/api/quizzes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Zorgt ervoor dat de token correct wordt meegestuurd
            },
            body: JSON.stringify({ ...quizData, questions: vragenData })
        });

        if (quizRes.ok) {
            alert("Quiz succesvol aangemaakt!");
            window.location.href = "teacher_dashboard.html";
        } else {
            const errorData = await quizRes.json();
            alert(`Fout bij opslaan quiz: ${errorData.error}`);
        }
    } catch (error) {
        console.error("❌ Fout bij opslaan quiz:", error);
        alert("Er is een fout opgetreden. Probeer opnieuw.");
    }
};

document.querySelector("#quizForm").addEventListener("submit", submitQuiz);