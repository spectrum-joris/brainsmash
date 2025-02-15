// import { createClient } from "@supabase/supabase-js";
import supabase from "../utilities/db.js";
import dotenv from "dotenv";
dotenv.config();

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const register = async (req, res) => {
    const { email, password, full_name, nickname, role, school, program, grade } = req.body;

    if (!email || !password || !full_name || !nickname || !role || !school || !program || !grade) {
        return res.status(400).json({ error: "Alle velden zijn verplicht." });
    }

    // ✅ Registreer gebruiker met metadata
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name, nickname, school, program, grade, role }
        }
    });

    if (signUpError) return res.status(400).json({ error: signUpError.message });

    // ✅ Geef feedback naar de frontend
    res.status(201).json({
        message: "Registratie gelukt! Check je e-mail om je account te bevestigen.",
        user: signUpData.user
    });
};

// ✅ Log de gebruiker in
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Vul zowel e-mail als wachtwoord in." });
    }

    // ✅ Log de gebruiker in en ontvang een session token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    // console.log("🔍 Debug: signInData:", signInData); // 🔹 Check of data correct terugkomt
    // console.log("🔍 Debug: signInError:", signInError); // 🔹 Check of er een foutmelding is

    if (signInError) return res.status(401).json({ error: signInError.message });

    const user = signInData.user;
    const accessToken = signInData.session?.access_token; // ✅ Haal het token op

    if (!accessToken) {
        return res.status(500).json({ error: "Geen sessie ontvangen vanuit Supabase." });
    }

    console.log("🔍 Debug: Ingelogde gebruiker:", user); // 🔹 Extra debug info

    // ✅ Controleer of gebruiker al in public.users staat
    const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("id, full_name, email, nickname, school, program, grade, role, avatar_url")
        .eq("id", user.id)
        .single();

    console.log("🔍 Debug: existingUser:", existingUser);
    console.log("🔍 Debug: existingUserError:", existingUserError);

    if (existingUserError && existingUserError.code !== "PGRST116") { // PGRST116 = geen rij gevonden
        return res.status(400).json({ error: existingUserError.message });
    }

    let finalUser = existingUser;

    if (!existingUser) {
        console.log("❌ Gebruiker niet gevonden in public.users, we voegen toe...");

        // ✅ Voeg gebruiker toe aan public.users als hij daar nog niet staat
        const { data: newUser, error: dbError } = await supabase.from("users").insert([
            {
                id: user.id,
                full_name: user.user_metadata.full_name,
                email: user.email,
                nickname: user.user_metadata.nickname,
                school: user.user_metadata.school,
                program: user.user_metadata.program,
                grade: user.user_metadata.grade,
                role: user.user_metadata.role,
                avatar_url: null
            }
        ]).select("*").single(); // ✅ Haal direct de nieuwe gebruiker op

        if (dbError) {
            console.log("❌ Debug: Fout bij toevoegen aan public.users:", dbError.message);
            return res.status(400).json({ error: dbError.message });
        }

        finalUser = newUser; // ✅ Gebruik de nieuwe gebruiker
    }

    // ✅ Stuur login data naar de frontend, inclusief de juiste role en token
    res.status(200).json({ 
        message: "Login succesvol!", 
        user: finalUser, 
        session: { access_token: accessToken }
    });
};

// ✅ Haal de gebruikersrol correct op uit `public.users`
export const getUserRole = async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

    if (error || !data) {
        return res.status(404).json({ error: "Gebruikersrol niet gevonden" });
    }

    res.json({ role: data.role });
};
