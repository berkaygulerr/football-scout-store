"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// İstemci tarafında Supabase kullanımı için yardımcı
export const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı olmalı");
  }

  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
};


