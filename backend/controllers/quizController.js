import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const getQuizzesForUser = async (req, res) => {
    const { user } = req;

    // Haal de graad en richting op van de gebruiker
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("graad, richting")
        .eq("id", user.id)
        .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    // Haal quizzen op die matchen met deze gebruiker
    const { data: quizzes, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("graad", profile.graad)
        .eq("richting", profile.richting);

    if (quizError) return res.status(500).json({ error: quizError.message });

    res.status(200).json(quizzes);
};

// 🔹 Vragen van een quiz ophalen
export const getQuizQuestions = async (req, res) => {
    const { quizId } = req.params;

    const { data: questions, error } = await supabase
        .from("quiz_questions")
        .select("id, question_text, type, options, correct_answers, time_limit")
        .eq("quiz_id", quizId);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(questions);
};

// 🔹 Antwoord controleren en score opslaan
export const submitAnswer = async (req, res) => {
    const { quizId } = req.params;
    const { questionId, userAnswer } = req.body;
    const { user } = req;

    // Haal het correcte antwoord op
    const { data: question, error } = await supabase
        .from("quiz_questions")
        .select("correct_answers")
        .eq("id", questionId)
        .single();

    if (error) return res.status(500).json({ error: error.message });

    // Check of het antwoord correct is
    const isCorrect = Array.isArray(question.correct_answers)
        ? question.correct_answers.includes(userAnswer)
        : question.correct_answers === userAnswer;

    // Sla het resultaat op
    const { error: insertError } = await supabase.from("quiz_results").insert([
        {
            user_id: user.id,
            quiz_id: quizId,
            question_id: questionId,
            answer_given: userAnswer,
            correct: isCorrect
        }
    ]);

    if (insertError) return res.status(500).json({ error: insertError.message });

    res.status(200).json({ correct: isCorrect });
};