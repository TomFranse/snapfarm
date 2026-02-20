export interface PlantImage {
  id: string;
  plant_id: string;
  tag: string;
  storage_path: string;
  display_order: number;
}

export interface PlantImageWithUrl extends PlantImage {
  public_url: string;
}
