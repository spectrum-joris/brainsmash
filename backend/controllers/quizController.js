// import { createClient } from "@supabase/supabase-js";
import supabase from "../utilities/db.js"
import dotenv from "dotenv";
dotenv.config();

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const getQuizzesForUser = async (req, res) => {
    const { id, program, grade } = req.user;

    if (!program || !grade) {
        return res.status(400).json({ error: "Program of grade niet gevonden in gebruikersprofiel." });
    }

    console.log(`✅ Gebruiker ${id} zoekt quizzen voor program: ${program}, grade: ${grade}`);

    // ✅ Haal quizzen op die matchen met de opleiding en graad van de gebruiker
    const { data: quizzes, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("program", program) // ✅ Match met program
        .eq("grade", grade); // ✅ Match met grade

    if (quizError) {
        console.error("❌ Fout bij ophalen quizzen:", quizError.message);
        return res.status(500).json({ error: "Fout bij ophalen quizzen." });
    }

    if (!quizzes || quizzes.length === 0) {
        return res.status(200).json([]); // ✅ Lege array als er geen quizzen zijn
    }

    res.status(200).json(quizzes);
};

export const getTeacherQuizzes = async (req, res) => {
    const { user } = req;

    // Controleer of de gebruiker een leerkracht is
    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || profile.role !== "leerkracht") {
        return res.status(403).json({ error: "Toegang geweigerd" });
    }

    // Haal quizzen op die door deze leerkracht zijn aangemaakt
    const { data: quizzes, error: quizError } = await supabase
        .from("quizzes")
        .select("id, title, course, difficulty, program, grade, created_at")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

    if (quizError) {
        console.error("❌ Fout bij ophalen quizzen:", quizError.message);
        return res.status(500).json({ error: "Kon quizzen niet ophalen." });
    }

    res.status(200).json(quizzes);
};

export const createQuiz = async (req, res) => {
    const { user } = req;
    const { title, course, difficulty, program, grade, questions } = req.body;

    if (!title || !course || !difficulty || !program || !grade || !questions.length) {
        return res.status(400).json({ error: "Alle velden en minstens één vraag zijn verplicht." });
    }

    // Quiz aanmaken
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert([{ teacher_id: user.id, title, course, difficulty, program, grade }])
        .select()
        .single();

    if (quizError) {
        return res.status(500).json({ error: "Kon quiz niet aanmaken." });
    }

    // Vragen toevoegen
    const vragenData = questions.map(q => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        type: q.type,
        options: q.options.length ? JSON.stringify(q.options) : null,
        correct_answers: JSON.stringify(q.correct_answers),
        time_limit: q.time_limit
    }));

    const { error: vraagError } = await supabase.from("questions").insert(vragenData);

    if (vraagError) {
        return res.status(500).json({ error: "Kon vragen niet opslaan." });
    }

    res.status(201).json({ message: "Quiz succesvol aangemaakt!" });
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