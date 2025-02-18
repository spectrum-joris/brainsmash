// import { createClient } from "@supabase/supabase-js";
import supabase from "../utilities/db.js";
import dotenv from "dotenv";
dotenv.config();

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Middleware om gebruiker en rol op te halen
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.warn("🚨 Geen token gevonden in request");
            return res.status(401).json({ error: "Geen token aanwezig" });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔍 Ontvangen token:", token); // 🔹 Debug: Token check
        supabase.auth.setAuth(token); // 🔥 Forceer Supabase om het juiste token te gebruiken!


        // ✅ Stap 1: Haal gebruiker op uit Supabase Auth
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError || !user) {
            console.error("❌ Ongeldige of verlopen token:", userError);
            return res.status(401).json({ error: "Ongeldige gebruiker of token verlopen" });
        }

        console.log("✅ Ingelogde gebruiker ID:", user.id);

        // ✅ Stap 2: Haal de gebruikersrol op uit `public.users`
        const { data: userData, error: userDataError } = await supabase
            .from("users") 
            .select("id, role, program, grade")
            .eq("id", user.id)
            .single();

            console.log("🔍 Opgehaalde userData:", userData);

        if (userDataError || !userData) {
            console.warn("⚠️ Geen profiel gevonden in de 'users' tabel voor user:", user.id);
            return res.status(403).json({ error: "Geen toegang - profiel niet gevonden" });
        }

        console.log("✅ Gebruikersprofiel gevonden in public.users:", userData.id);
        console.log("✅ Gebruikersrol:", userData.role);
        console.log("✅ Program:", userData.program, "| Grade:", userData.grade);

        // ✅ Stap 3: Sla de gebruiker en zijn rol op in de request en ga door naar de volgende middleware
        req.user = { id: user.id, role: userData.role, program: userData.program, grade: userData.grade };
        next();

    } catch (err) {
        console.error("❌ Interne fout in authMiddleware:", err.message);
        res.status(500).json({ error: "Interne serverfout bij authenticatie" });
    }
};

export default authMiddleware;
