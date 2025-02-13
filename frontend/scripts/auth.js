document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // ✅ Pak alle waarden correct op uit de inputvelden
            const fullName = document.querySelector("#full_name")?.value.trim();
            const nickname = document.querySelector("#nickname")?.value.trim();
            const email = document.querySelector("#email")?.value.trim();
            const password = document.querySelector("#password")?.value.trim();
            const role = document.querySelector("#role")?.value.trim();
            const school = document.querySelector("#school")?.value.trim();
            const program = document.querySelector("#program")?.value.trim();
            const grade = document.querySelector("#grade")?.value.trim();

            // ✅ Debugging: Log de waarden om te checken of ze correct worden opgehaald
            console.log("🔍 Debug: Invoervelden", { fullName, nickname, email, password, role, school, program, grade });

            // ✅ Controleer of alle velden correct zijn ingevuld
            if (!fullName || !nickname || !email || !password || !role || !school || !program || !grade) {
                alert("Vul alle velden in.");
                return;
            }

            // ✅ Stuur de data naar de backend
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: fullName,
                    nickname,
                    email,
                    password,
                    role,
                    school,
                    program,
                    grade
                })
            });

            const data = await res.json();

            if (data.error) {
                alert("Registratie mislukt: " + data.error);
            } else {
                alert("Succesvol geregistreerd!");
                window.location.href = "/pages/login.html"; // ✅ Correct pad naar loginpagina
            }
        });
    }
});

// ✅ Controleer of we op de loginpagina zijn
const loginForm = document.querySelector("#loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailField = document.querySelector("#email");
        const passwordField = document.querySelector("#password");

        if (!emailField || !passwordField) {
            console.error("❌ FOUT: Email of wachtwoord veld niet gevonden in de DOM.");
            return;
        }

        const errorMessage = document.querySelector("#error-message");
        errorMessage.innerText = ""; // Reset foutmelding

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailField.value,
                password: passwordField.value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            errorMessage.innerText = data.error; // Toon foutmelding in de UI
            return;
        }

        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/pages/dashboard.html"; // ✅ Correct pad naar dashboard
    });
};
