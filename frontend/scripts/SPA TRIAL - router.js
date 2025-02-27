export async function handleRouteChange() {
    await waitForElement("#main-content"); // Zorg ervoor dat main-content bestaat

    const route = window.location.pathname.replace("/", "") || "dashboard_student"; // Default pagina
    const contentContainer = document.getElementById("main-content");

    if (!contentContainer) {
        console.error("❌ Kan de main-content niet vinden!");
        return;
    }

    try {
        const response = await fetch(`/frontend/pages/${route}.html`);
        if (!response.ok) throw new Error("Pagina niet gevonden");

        contentContainer.innerHTML = await response.text();
        console.log(`✅ Pagina geladen: ${route}`);

        // ✅ Loginpagina verwijderen bij navigatie
        if (route !== "login") {
            const loginContainer = document.getElementById("login-container");
            if (loginContainer) loginContainer.remove();
        }
    } catch (error) {
        console.error("❌ Fout bij laden van pagina:", error);
        contentContainer.innerHTML = "<p>Deze pagina kon niet worden geladen.</p>";
    }
}

// ✅ DOMContentLoaded goed gestructureerd
document.addEventListener("DOMContentLoaded", async () => {
    await waitForElement("#main-content"); // Wacht tot main-content beschikbaar is
    handleRouteChange();

    // ✅ Navigatie zonder refresh
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const page = link.getAttribute("data-page");
            window.history.pushState({}, "", `/${page}`);
            handleRouteChange();
        });
    });

    // ✅ Browser back/forward ondersteuning
    window.addEventListener("popstate", handleRouteChange);
});

// ✅ Wacht tot een element beschikbaar is
async function waitForElement(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}
