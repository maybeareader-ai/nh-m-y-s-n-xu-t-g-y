export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface CraftItem {
  id: string;
  name: string;
  image: string; // URL or data URL
  presetId?: string;
  description: string; // Chú thích
  tray: 'tray1' | 'tray2';
  rarity?: ItemRarity;
  customLore?: string[];
  createdAt: number;
}

export interface CraftedRecipe {
  id: string;
  itemAId: string; // Ingredient from tray 1 or general
  itemBId: string; // Ingredient from tray 2 or general
  resultItem: {
    id: string;
    name: string;
    image: string;
    description: string;
    rarity?: ItemRarity;
  };
  // Trang chi tiết công thức (Detailed page content)
  doc: {
    title: string;
    subtitle?: string;
    story: string; // Văn bản / Cốt truyện / Giới thiệu
    formulaSteps: string[]; // Các bước tiến hành công thức
    properties?: { label: string; value: string }[];
    images: string[]; // Danh sách hình ảnh minh hoạ thêm
    notes: string; // Ghi chú cá nhân của người dùng
    updatedAt: number;
  };
}

export interface TrayConfig {
  id: 'tray1' | 'tray2';
  title: string;
  subtitle: string;
  color: string;
}
