import { getSupabase, isSupabaseConfigured } from "@shared/services/supabaseService";
import type { Plant, PlantListItem } from "../types/plants.types";

export const getPlants = async (): Promise<PlantListItem[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("plants")
    .select("id, type, description")
    .order("type", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PlantListItem[];
};

/** Plant fields needed for card game: opt values and effects. Excludes test-plant. */
export const getPlantsForCards = async (): Promise<Plant[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("plants")
    .select("id, type, l_opt, s_opt, m_opt, w_opt, r_opt, effects")
    .neq("id", "test-plant")
    .order("type", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Plant[];
};

export const getPlantById = async (id: string): Promise<Plant | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();
  const { data, error } = await supabase.from("plants").select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Plant;
};
