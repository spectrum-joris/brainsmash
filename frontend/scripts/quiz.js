const quizId = new URLSearchParams(window.location.search).get("id");
let currentQuestionIndex = 0;
let questions = [];
let timerInterval;

const fetchQuestions = async () => {
    const res = await fetch(`/api/quizzes/${quizId}/questions`, {
        method: "GET",
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}` }
    });

    questions = await res.json();
    loadQuestion();
};

const loadQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
        alert("Quiz voltooid!");
        window.location.href = "dashboard.html";
        return;
    }

    const question = questions[currentQuestionIndex];
    document.querySelector("#questionText").innerText = question.question_text;
    document.querySelector("#timeLeft").innerText = question.time_limit;

    const answersDiv = document.querySelector("#answers");
    answersDiv.innerHTML = "";

    if (question.type === "multiple_choice") {
        question.options.forEach(option => {
            const btn = document.createElement("button");
            btn.innerText = option;
            btn.onclick = () => submitAnswer(option);
            answersDiv.appendChild(btn);
        });
    } else {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "openAnswer";
        answersDiv.appendChild(input);
    }

    startTimer(question.time_limit);
};

const startTimer = (time) => {
    clearInterval(timerInterval);
    let timeLeft = time;
    timerInterval = setInterval(() => {
        document.querySelector("#timeLeft").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Tijd voorbij!");
            nextQuestion();
        }
        timeLeft--;
    }, 1000);
};

const submitAnswer = async (answer) => {
    const res = await fetch(`/api/quizzes/${quizId}/answer`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}`
        },
        body: JSON.stringify({
            questionId: questions[currentQuestionIndex].id,
            userAnswer: answer || document.querySelector("#openAnswer").value
        })
    });

    const data = await res.json();
    document.querySelector("#feedback").innerText = data.correct ? "Correct!" : "Fout!";
    setTimeout(nextQuestion, 2000);
};

const nextQuestion = () => {
    currentQuestionIndex++;
    loadQuestion();
};

document.querySelector("#speakBtn").addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(document.querySelector("#questionText").innerText);
    speechSynthesis.speak(utterance);
});

fetchQuestions();
