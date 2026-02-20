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
