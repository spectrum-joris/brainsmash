// import { createClient } from "@supabase/supabase-js";
import supabase from "../utilities/db.js";
import dotenv from "dotenv";
dotenv.config();

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Gebruiker registreren
export const register = async (req, res) => {
    const { email, password, full_name, nickname, role, school, program, grade } = req.body;

    console.log("🔍 Debug: Ontvangen data in backend:", req.body);

    if (!email || !password || !full_name || !nickname || !role || !school || !program || !grade) {
        return res.status(400).json({ error: "Alle velden zijn verplicht." });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    const { error: dbError } = await supabase.from("public.users").insert([
        { id: data.user.id, nickname, school, program, grade, avatar_url: null }
    ]);

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.status(201).json({ message: "Registratie succesvol!", user: data.user });
};

// 🔹 Gebruiker inloggen
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Vul zowel e-mail als wachtwoord in." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.log("❌ Login mislukte:", error.message);
        return res.status(401).json({ error: "Ongeldige inloggegevens. Controleer je e-mail en wachtwoord." });
    }

    res.status(200).json({ user: data.user });
};

// Get user role
export const getUserRole = async (req, res) => {
    res.status(200).json({ role: req.public.user.role });
};
