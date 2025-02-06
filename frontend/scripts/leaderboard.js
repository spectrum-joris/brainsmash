const fetchLeaderboard = async () => {
    const res = await fetch("/api/leaderboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}` }
    });

    const leaderboard = await res.json();
    const table = document.querySelector("#leaderboard");

    leaderboard.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.nickname}</td>
            <td>${player.score}</td>
            <td>${player.badge || "-"}</td>
            <td>${player.school}</td>
        `;
        table.appendChild(row);
    });
};

const fetchUserRanking = async () => {
    const res = await fetch("/api/leaderboard/ranking", {
        method: "GET",
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}` }
    });

    const ranking = await res.json();
    document.querySelector("#userRanking").innerText = `Jouw positie: ${ranking.ranking}`;
};

fetchLeaderboard();
fetchUserRanking();
