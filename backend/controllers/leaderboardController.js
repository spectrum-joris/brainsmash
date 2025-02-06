import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Top 10 per richting ophalen
export const getLeaderboard = async (req, res) => {
    const { user } = req;

    // Haal richting van de gebruiker op
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("richting")
        .eq("id", user.id)
        .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    // Haal de top 10 spelers in deze richting
    const { data: leaderboard, error: leaderboardError } = await supabase
        .from("leaderboard")
        .select("nickname, score, badge, school")
        .eq("richting", profile.richting)
        .order("score", { ascending: false })
        .limit(10);

    if (leaderboardError) return res.status(500).json({ error: leaderboardError.message });

    res.status(200).json(leaderboard);
};

// 🔹 Huidige ranking van de gebruiker ophalen
export const getUserRanking = async (req, res) => {
    const { user } = req;

    // Haal richting van de gebruiker op
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("richting")
        .eq("id", user.id)
        .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    // Haal de positie van de gebruiker op
    const { data: rankingData, error: rankingError } = await supabase.rpc("get_user_ranking", { user_id: user.id });

    if (rankingError) return res.status(500).json({ error: rankingError.message });

    res.status(200).json(rankingData);
};
