import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Nieuwe quiz aanmaken
export const createQuiz = async (req, res) => {
    const { titel, moeilijkheidsgraad, richting, graad, vragen } = req.body;
    const { user } = req;

    // Controleer of de gebruiker een leerkracht is
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || profile.role !== "leerkracht") {
        return res.status(403).json({ error: "Toegang geweigerd" });
    }

    // Stap 1: Quiz aanmaken
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert([{ leerkracht_id: user.id, titel, moeilijkheidsgraad, richting, graad }])
        .select()
        .single();

    if (quizError) return res.status(500).json({ error: quizError.message });

    // Stap 2: Vragen toevoegen
    for (let vraag of vragen) {
        const { error: vraagError } = await supabase
            .from("quiz_questions")
            .insert([{ 
                quiz_id: quiz.id, 
                question_text: vraag.question_text, 
                type: vraag.type, 
                options: vraag.options, 
                correct_answers: vraag.correct_answers, 
                time_limit: vraag.time_limit 
            }]);

        if (vraagError) return res.status(500).json({ error: vraagError.message });
    }

    res.status(201).json({ message: "Quiz aangemaakt!" });
};
