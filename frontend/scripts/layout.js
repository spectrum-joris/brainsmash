document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "/pages/login.html";
        return;
    }

    const headerFile = user.role === "leerling" ? "header_student.html" : "header_teacher.html";

    // Laad de header en footer
    document.querySelector("#header").innerHTML = await (await fetch(`/components/${headerFile}`)).text();
    document.querySelector("#footer").innerHTML = await (await fetch("/components/footer.html")).text();

    // Voeg logout functionaliteit toe
    document.querySelector("#logout").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "/pages/login.html";
    });
});
