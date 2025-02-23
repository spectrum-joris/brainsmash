import supabase from './db.js'; // Zorg dat db.js een geconfigureerde Supabase client exporteert

export const uploadProfilePictureUtil = async (file, userId) => {
  // Zorg voor een unieke bestandsnaam (gebruik userId + timestamp)
  const filePath = `avatars/${userId}-${Date.now()}-${file.originalname}`;

  // Upload het bestand naar Supabase Storage (avatars bucket)
  const { data, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file.buffer, {
      cacheControl: "3600",
      upsert: true // Hiermee overschrijf je een oude avatar als die al bestaat
    });

  if (uploadError) {
    throw uploadError;
  }

  // Verkrijg de public URL van het geüploade bestand
  const { publicUrl } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return publicUrl;
};
