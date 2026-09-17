import { CraftItem, CraftedRecipe, TrayConfig } from '../types';

export const DEFAULT_TRAYS: TrayConfig[] = [
  {
    id: 'tray1',
    title: 'Khay 1',
    subtitle: '',
    color: '#0284c7', // blue
  },
  {
    id: 'tray2',
    title: 'Khay 2',
    subtitle: '',
    color: '#9333ea', // purple
  },
];

// Tất cả vật phẩm đều chưa tồn tại theo yêu cầu người dùng
export const DEFAULT_ITEMS: CraftItem[] = [];

export const DEFAULT_RECIPES: CraftedRecipe[] = [];

const STORAGE_KEYS = {
  ITEMS: 'mc_crafting_items_v3_empty',
  RECIPES: 'mc_crafting_recipes_v3_empty',
  TRAYS: 'mc_crafting_trays_v3_empty',
};

export function loadStoredItems(): CraftItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load items from storage:', e);
  }
  return DEFAULT_ITEMS;
}

export function saveStoredItems(items: CraftItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to storage:', e);
  }
}

export function loadStoredRecipes(): CraftedRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECIPES);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load recipes from storage:', e);
  }
  return DEFAULT_RECIPES;
}

export function saveStoredRecipes(recipes: CraftedRecipe[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  } catch (e) {
    console.error('Failed to save recipes to storage:', e);
  }
}

export function loadStoredTrays(): TrayConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAYS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load trays from storage:', e);
  }
  return DEFAULT_TRAYS;
}

export function saveStoredTrays(trays: TrayConfig[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRAYS, JSON.stringify(trays));
  } catch (e) {
    console.error('Failed to save trays to storage:', e);
  }
}
