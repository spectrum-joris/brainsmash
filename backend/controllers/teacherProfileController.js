import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Profielgegevens ophalen
export const getTeacherProfile = async (req, res) => {
    const { user } = req;

    // Haal profielinformatie op
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("nickname, email, school, richting, avatar_url")
        .eq("id", user.id)
        .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    // Haal statistieken over de aangemaakte quizzen op
    const { data: quizStats, error: quizStatsError } = await supabase
        .rpc("get_teacher_quiz_statistics", { teacher_id: user.id });

    if (quizStatsError) return res.status(500).json({ error: quizStatsError.message });

    res.status(200).json({
        profile,
        quizStats
    });
};

// 🔹 Profielfoto uploaden
export const uploadProfilePicture = async (req, res) => {
    const { user } = req;
    if (!req.file) return res.status(400).json({ error: "Geen bestand geüpload" });

    const fileBuffer = req.file.buffer;
    const filePath = `avatars/${user.id}.jpg`;

    // Upload bestand naar Supabase Storage
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true
    });

    if (uploadError) return res.status(500).json({ error: uploadError.message });

    // Update profielfoto-URL in database
    const avatarUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}.jpg`;
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    res.status(200).json({ avatar_url: avatarUrl });
};
