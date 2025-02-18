document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        console.log("✅ Registerpagina gedetecteerd, scholen en graden ophalen...");
        fetchScholen();
        fetchGraden();
        fetchRichtingen();

        // ✅ Voeg event listener toe voor het registreren van een gebruiker
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // ✅ Pak alle waarden correct op uit de inputvelden
            const fullName = document.querySelector("#full_name")?.value.trim();
            const nickname = document.querySelector("#nickname")?.value.trim();
            const email = document.querySelector("#email")?.value.trim();
            const password = document.querySelector("#password")?.value.trim();
            const role = document.querySelector("#role")?.value.trim();
            const schoolId = document.querySelector("#school")?.value.trim();
            const program = document.querySelector("#program")?.value.trim();
            const grade = document.querySelector("#grade")?.value.trim();

            console.log("🔍 Debug: Invoervelden", { fullName, nickname, email, password, role, schoolId, program, grade });

            if (!fullName || !nickname || !email || !password || !role || !schoolId || !program || !grade) {
                alert("Vul alle velden in.");
                return;
            }

            // ✅ Stuur de data naar de backend
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        full_name: fullName,
                        nickname,
                        email,
                        password,
                        role,
                        school_id: schoolId,
                        program_id: program,
                        grade_id: grade
                    })
                });

                const data = await res.json();

                if (data.error) {
                    alert("Registratie mislukt: " + data.error);
                } else {
                    alert("Succesvol geregistreerd!");
                    window.location.href = "/pages/login.html"; 
                }
            } catch (error) {
                console.error("❌ FOUT bij registratie:", error);
                alert("Er is een fout opgetreden bij het registreren. Probeer opnieuw.");
            }
        });
    } else {
        console.log("✅ Niet op de registratiepagina, geen onnodige code uitgevoerd.");
    }
});

// ✅ Haal de scholen op via de backend
async function fetchScholen() {
    try {
        const res = await fetch("/api/database/schools");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Kan scholen niet laden.");
        
        const selectElement = document.getElementById("school");
        if (!selectElement) return console.error("❌ FOUT: Element #school niet gevonden!");

        data.sort((a, b) => a.school_name.localeCompare(b.school_name))

        data.forEach((school) => {
            const option = document.createElement("option");
            option.value = school.id;
            option.textContent = school.school_name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("❌ FOUT bij het ophalen van scholen:", error);
    }
}

// ✅ Haal de graden op via de backend
async function fetchGraden() {
    try {
        const res = await fetch("/api/database/grades");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Kan graden niet laden.");

        const selectElement = document.getElementById("grade");
        if (!selectElement) return console.error("❌ FOUT: Element #grade niet gevonden!");

        data.sort((a, b) => a.grade_name.localeCompare(b.grade_name))

        data.forEach((grade) => {
            const option = document.createElement("option");
            option.value = grade.id;
            option.textContent = grade.grade_name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("❌ FOUT bij het ophalen van graden:", error);
    }
}

// ✅ Haal de richtingen op via de backend
async function fetchRichtingen() {
    try {
        const res = await fetch("/api/database/programs");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Kan richtingen niet laden.");

        const selectElement = document.getElementById("program");
        if (!selectElement) return console.error("❌ FOUT: Element #program niet gevonden!");

        data.sort((a, b) => a.program_name.localeCompare(b.program_name))

        data.forEach((program) => {
            const option = document.createElement("option");
            option.value = program.id;
            option.textContent = program.program_name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("❌ FOUT bij het ophalen van richtingen:", error);
    }
}
