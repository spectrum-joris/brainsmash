import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Gebruiker registreren
export const register = async (req, res) => {
    const { email, password, nickname, school, richting, graad } = req.body;

    // Stap 1: Gebruiker aanmaken in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    // Stap 2: Extra gegevens opslaan in de 'profiles' tabel
    const { error: dbError } = await supabase.from("profiles").insert([
        { id: data.user.id, nickname, school, richting, graad, avatar_url: null }
    ]);

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.status(201).json({ message: "Registratie succesvol!", user: data.user });
};

// 🔹 Gebruiker inloggen
export const login = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: error.message });

    res.status(200).json({ user: data.user });
};

// Get user role
export const getUserRole = async (req, res) => {
    res.status(200).json({ role: req.user.role });
};
