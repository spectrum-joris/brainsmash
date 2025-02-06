import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Profielgegevens ophalen
export const getProfile = async (req, res) => {
    const { user } = req;

    // Haal profielinformatie op
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("nickname, avatar_url, school, richting, graad, xp, qbit")
        .eq("id", user.id)
        .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    // Haal verdiende badges op
    const { data: badges, error: badgeError } = await supabase
        .from("badge_user")
        .select("badge")
        .eq("user_id", user.id);

    if (badgeError) return res.status(500).json({ error: badgeError.message });

    // Haal quizstatistieken op
    const { data: quizStats, error: quizStatsError } = await supabase
        .rpc("get_quiz_statistics", { user_id: user.id });

    if (quizStatsError) return res.status(500).json({ error: quizStatsError.message });

    // Kies een random motivatiequote uit de database
    const { data: quotes, error: quoteError } = await supabase
        .from("motivation_quotes")
        .select("text, meme_url")
        .order("random()")
        .limit(1);

    if (quoteError) return res.status(500).json({ error: quoteError.message });

    res.status(200).json({
        profile,
        badges: badges.map(b => b.badge),
        quizStats,
        motivation: quotes[0]
    });
};
