const registerForm = document.querySelector("#registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
        nickname: document.querySelector("#nickname").value,
        school: document.querySelector("#school").value,
        richting: document.querySelector("#richting").value,
        graad: document.querySelector("#graad").value
    };

    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (data.error) {
        alert("Registratie mislukt: " + data.error);
    } else {
        alert("Succesvol geregistreerd!");
        window.location.href = "login.html";
    }
});

const loginForm = document.querySelector("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value
        })
    });

    const data = await res.json();

    if (data.error) {
        alert("Login mislukt!");
    } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "dashboard.html";
    }
});
