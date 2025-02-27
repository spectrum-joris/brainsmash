import { handleRouteChange } from "./router.js";  // ✅ BELANGRIJKE IMPORT TOEGEVOEGD!
import { enableMouseFollowEffect } from "./utilities/auth-mouse_follow.js";

document.addEventListener("DOMContentLoaded", () => {

    // ✅ Gebruik exact jouw werkende login code zonder enige wijziging
    enableMouseFollowEffect();

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

            // ✅ EXACT JOUW CODE - Bewaar user info zoals jij had
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.session.access_token);

            console.log("✅ Token opgeslagen:", data.session.access_token);

            const role = data.user?.user_metadata?.role;
            console.log("✅ Debug: Gebruikersrol:", role);

            if (!role) {
                console.error("❌ FOUT: Gebruikersrol niet gevonden!");
                errorMessage.innerText = "Geen geldige rol gevonden.";
                return;
            }

            // ✅ VERVANG `window.location.href` DOOR SPA-NAVIGATIE
            const page = role === "leerling" ? "dashboard_student" :
                         role === "leerkracht" ? "dashboard_teacher" : "dashboard";

            window.history.pushState({}, "", `/${page}`);
            setTimeout(() => handleRouteChange(), 50); // Wacht kort om zeker te zijn dat alles geladen is
        } catch (error) {
            console.error("❌ FOUT: Probleem met login request:", error);
            errorMessage.innerText = "Er is een fout opgetreden bij het inloggen.";
        }
    });
});
