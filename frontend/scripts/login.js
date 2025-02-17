document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Loginpagina geladen.");

    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    console.log("✅ LoginForm gevonden.");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailField = document.querySelector("#email");
        const passwordField = document.querySelector("#password");

        if (!emailField || !passwordField) {
            console.error("❌ FOUT: Email of wachtwoord veld niet gevonden.");
            return;
        }

        const errorMessage = document.querySelector("#error-message");
        errorMessage.innerText = "";

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailField.value, password: passwordField.value })
            });

            const data = await res.json();
            console.log("✅ Debug: Login response:", data);

            if (!res.ok || data.error) {
                errorMessage.innerText = data.error || "Login mislukt.";
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.session.access_token);

            console.log("✅ Token opgeslagen:", data.session.access_token);

            const role = data.user?.user_metadata?.role;
            console.log("✅ Debug: Gebruikersrol:", role);

            if (role === "leerling") {
                window.location.href = "/pages/dashboard_student.html";
            } else if (role === "leerkracht") {
                window.location.href = "/pages/dashboard_teacher.html";
            } else {
                window.location.href = "/pages/dashboard.html";
            }
        } catch (error) {
            console.error("❌ FOUT: Probleem met login request:", error);
            errorMessage.innerText = "Er is een fout opgetreden bij het inloggen.";
        }
    });
});
