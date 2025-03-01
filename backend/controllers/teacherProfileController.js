import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { uploadProfilePictureUtil } from "../utilities/uploadProfilePicture.js";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Profielgegevens ophalen voor leerkrachten (gebruikmakend van de "users" tabel)
export const getTeacherProfile = async (req, res) => {
  const { user } = req;

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select(`
        nickname, 
        email, 
        avatar_url, 
        school: schools( school_name ), 
        school:schools ( school_name ),
        program:programs ( program_name ),
        grade:grades ( grade_name )
        `)
    .eq("id", user.id)
    .single();

  if (profileError) return res.status(400).json({ error: profileError.message });

  const { data: quizStats, error: quizStatsError } = await supabase
    .rpc("get_teacher_quiz_statistics", { teacher_id: user.id });

  if (quizStatsError) return res.status(500).json({ error: quizStatsError.message });

  res.status(200).json({
    profile,
    quizStats
  });
};

// 🔹 Profielfoto uploaden voor leerkrachten met de centrale utility
export const uploadProfilePicture = async (req, res) => {
  const { user } = req;
  if (!req.file) return res.status(400).json({ error: "Geen bestand geüpload" });

  try {
    const publicUrl = await uploadProfilePictureUtil(req.file, user.id);

    // Update de profielfoto-URL in de "users" tabel
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    res.status(200).json({ avatar_url: publicUrl });
  } catch (error) {
    console.error("Upload fout:", error);
    res.status(500).json({ error: "Er is een fout opgetreden bij het uploaden" });
  }
};
