// Haal de rol op en laad de juiste header
const loadHeader = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Vraag de rol op van de backend
    const res = await fetch("/api/auth/role", {
        method: "GET",
        headers: { Authorization: `Bearer ${user.access_token}` }
    });

    const data = await res.json();
    const role = data.role;

    // Kies de juiste header
    const headerFile = role === "leerkracht" ? "../components/header_teacher.html" : "../components/header_student.html";

    fetch(headerFile)
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
            document.querySelector("#logoutBtn").addEventListener("click", logout);
        });
};

// Footer laden
fetch("../components/footer.html")
    .then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);
    });

// Uitloggen functie
const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
};

// Laad de header zodra de pagina geladen is
loadHeader();
