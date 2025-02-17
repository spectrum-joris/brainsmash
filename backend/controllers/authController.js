import supabase from "../utilities/db.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    const { email, password, full_name, nickname, role, school_id, program_id, grade_id } = req.body;

    // ✅ Check of alle velden zijn ingevuld
    if (!email || !password || !full_name || !nickname || !role || !school_id || !program_id || !grade_id) {
        return res.status(400).json({ error: "Alle velden zijn verplicht." });
    }

    try {
        // ✅ Registreer gebruiker met metadata (ID's direct gebruiken)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { 
                    full_name, 
                    nickname, 
                    role,
                    school_id,   
                    grade_id,    
                    program_id   
                }
            }
        });

        console.log("🔍 Debug: signUpData:", JSON.stringify(signUpData, null, 2));


        if (signUpError) {
            return res.status(400).json({ error: signUpError.message });
        }

        // ✅ Geef feedback naar de frontend
        res.status(201).json({
            message: "Registratie gelukt! Check je e-mail om je account te bevestigen.",
            user: signUpData.user
        });

    } catch (err) {
        console.error("❌ Fout bij registratie:", err);
        res.status(500).json({ error: "Interne serverfout" });
    }
};


// ✅ Log de gebruiker in
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Vul zowel e-mail als wachtwoord in." });
    }

    // ✅ Log de gebruiker in en ontvang een session token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) return res.status(401).json({ error: signInError.message });

    const user = signInData.user;
    const accessToken = signInData.session?.access_token;

    if (!accessToken) {
        return res.status(500).json({ error: "Geen sessie ontvangen vanuit Supabase." });
    }

    console.log("🔍 Debug: Ingelogde gebruiker:", user);

    // ✅ Controleer of gebruiker al in `public.users` staat
    const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("id, full_name, email, nickname, school_id, program_id, grade_id, role, avatar_url")
        .eq("id", user.id)
        .single();

    if (existingUserError && existingUserError.code !== "PGRST116") { 
        return res.status(400).json({ error: existingUserError.message });
    }

    let finalUser = existingUser;
    console.log("🔍 Controleer of gebruiker al in `public.users` staat...");
    console.log("🔍 Gebruiker ID:", user.id);
    console.log("🔍 user_metadata ontvangen:", user.user_metadata);


    if (!existingUser) {
        console.log("❌ Gebruiker niet gevonden in `public.users`, we voegen toe...");

        // ✅ Voeg de gebruiker toe aan `public.users`
        const { data: newUser, error: dbError } = await supabase.from("users").insert([
            {
                id: user.id,
                full_name: user.user_metadata.full_name || user.email.split("@")[0],
                email: user.email,
                nickname: user.user_metadata.nickname || "Geen nickname",
                school_id: user.user_metadata.school_id,  // ID's niet names
                program_id: user.user_metadata.program_id, // idem
                grade_id: user.user_metadata.grade_id, // idem
                role: user.user_metadata.role,
                avatar_url: null
            }
        ]).select("*").single();

        if (dbError) {
            console.log("❌ Debug: Fout bij toevoegen aan `public.users`:", dbError.message);
            return res.status(400).json({ error: dbError.message });
        }

        finalUser = newUser;
    }

    // ✅ Stuur login data naar de frontend
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
